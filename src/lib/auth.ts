
import { Employee, UserRole } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Store the current user in session storage
let currentUser: Employee | null = null;

// Auth methods for our CRM
export const auth = {
  // Login with employee ID and password
  login: async (employeeId: string, password: string): Promise<Employee | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { employeeId, password }
      });

      if (error || !data || !data.employee) {
        console.error("Login error:", error || "No employee data returned");
        return null;
      }

      const employee = data.employee as Employee;
      
      // Store in session
      sessionStorage.setItem('currentUser', JSON.stringify(employee));
      currentUser = employee;
      
      return employee;
    } catch (error) {
      console.error("Login exception:", error);
      return null;
    }
  },
  
  // Logout current user
  logout: (): void => {
    sessionStorage.removeItem('currentUser');
    currentUser = null;
  },
  
  // Get current logged in user
  getCurrentUser: (): Employee | null => {
    if (currentUser) return currentUser;
    
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      currentUser = JSON.parse(userJson);
      return currentUser;
    }
    
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return auth.getCurrentUser() !== null;
  },
  
  // Check if user has specific role
  hasRole: (role: UserRole): boolean => {
    const user = auth.getCurrentUser();
    return user !== null && user.role === role;
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    return auth.hasRole("admin");
  },
  
  // Check if user can access specific feature based on role
  canAccess: (feature: string): boolean => {
    const user = auth.getCurrentUser();
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
