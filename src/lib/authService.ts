
import { supabase } from "@/integrations/supabase/client";
import { Employee, UserRole } from "./types";

// Interface for authentication results
interface AuthResult {
  success: boolean;
  message?: string;
  employee?: Employee;
}

// Store the current user in session storage and memory
let currentUser: Employee | null = null;

// Event listeners for auth state changes
type AuthChangeListener = (employee: Employee | null) => void;
const authChangeListeners: AuthChangeListener[] = [];

// Auth service for our CRM
export const authService = {
  // Login with username and password
  login: async (username: string, password: string): Promise<AuthResult> => {
    try {
      console.log(`Attempting to login with username: ${username}`);
      
      const { data, error } = await supabase.functions.invoke('employee-auth', {
        body: { action: 'login', username, password }
      });

      if (error) {
        console.error("Supabase function error:", error);
        return { 
          success: false, 
          message: `Authentication failed: ${error.message}` 
        };
      }

      if (!data || data.status === 'error') {
        console.error("Auth error:", data?.error || "Unknown error");
        return { 
          success: false, 
          message: data?.error || "Authentication failed" 
        };
      }

      const employee = data.employee as Employee;
      console.log("Login successful, employee data:", employee);
      
      // Store in session and memory
      sessionStorage.setItem('currentUser', JSON.stringify(employee));
      currentUser = employee;
      
      // Notify listeners
      notifyAuthChangeListeners(employee);
      
      return { 
        success: true, 
        employee 
      };
    } catch (error) {
      console.error("Login exception:", error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  },
  
  // Logout current user
  logout: async (): Promise<AuthResult> => {
    try {
      const employeeId = currentUser?.id;
      
      if (employeeId) {
        // Call logout function to log activity
        await supabase.functions.invoke('employee-auth', {
          body: { action: 'logout', employeeId }
        });
      }
      
      // Clear session and memory regardless of API result
      sessionStorage.removeItem('currentUser');
      currentUser = null;
      
      // Notify listeners
      notifyAuthChangeListeners(null);
      
      return { success: true };
    } catch (error) {
      console.error("Logout exception:", error);
      // Still clear local session even if API call fails
      sessionStorage.removeItem('currentUser');
      currentUser = null;
      notifyAuthChangeListeners(null);
      
      return { 
        success: true, 
        message: "Logged out locally but server sync failed" 
      };
    }
  },
  
  // Get current logged in user
  getCurrentUser: (): Employee | null => {
    if (currentUser) return currentUser;
    
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      try {
        currentUser = JSON.parse(userJson);
        return currentUser;
      } catch (e) {
        console.error("Error parsing user from session storage:", e);
        return null;
      }
    }
    
    return null;
  },
  
  // Initialize auth state from session storage
  initialize: (): void => {
    const user = authService.getCurrentUser();
    if (user) {
      notifyAuthChangeListeners(user);
    }
  },
  
  // Subscribe to auth state changes
  onAuthStateChange: (callback: AuthChangeListener): (() => void) => {
    authChangeListeners.push(callback);
    
    // Immediately call with current state
    callback(authService.getCurrentUser());
    
    // Return unsubscribe function
    return () => {
      const index = authChangeListeners.indexOf(callback);
      if (index > -1) {
        authChangeListeners.splice(index, 1);
      }
    };
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authService.getCurrentUser() !== null;
  },
  
  // Check if user has specific role
  hasRole: (role: UserRole): boolean => {
    const user = authService.getCurrentUser();
    return user !== null && user.role === role;
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    return authService.hasRole("admin");
  },
  
  // Check if user can access specific feature based on role
  canAccess: (feature: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    switch (feature) {
      case "employees":
        return user.role === "admin";
      case "customers":
        return true; // All roles can access customers
      case "orders":
        return true; // All roles can access orders
      case "inventory":
        return user.role === "admin" || user.role === "manager";
      case "tasks":
        return true; // All roles can access tasks
      default:
        return false;
    }
  }
};

// Helper function to notify all listeners of auth state changes
function notifyAuthChangeListeners(user: Employee | null): void {
  for (const listener of authChangeListeners) {
    listener(user);
  }
}
