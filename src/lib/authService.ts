
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  name: string;
  email?: string;
  role: 'admin' | 'sales_rep' | 'manager';
}

interface AuthResponse {
  status: 'success' | 'error';
  employee?: Employee;
  error?: string;
}

// Store the employee in localStorage
const EMPLOYEE_STORAGE_KEY = 'pavittar_pharma_employee';

// For state change listeners
type AuthChangeListener = (employee: Employee | null) => void;
const listeners: AuthChangeListener[] = [];

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Calling employee-auth function with username:', username);
      
      const { data, error } = await supabase.functions.invoke('employee-auth', {
        body: { action: 'login', username, password }
      });
      
      console.log('Auth function response:', data, error);
      
      if (error) {
        console.error('Error calling auth function:', error);
        return { status: 'error', error: error.message };
      }
      
      if (data.status === 'success' && data.employee) {
        // Store employee data in localStorage
        localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(data.employee));
        
        // Notify listeners
        this._notifyListeners(data.employee);
        
        return data as AuthResponse;
      } else {
        console.error('Auth function returned error:', data);
        return { status: 'error', error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error during login'
      };
    }
  },
  
  async logout(): Promise<{success: boolean, message?: string}> {
    try {
      // Call the logout endpoint
      const employee = this.getCurrentEmployee();
      
      if (employee) {
        await supabase.functions.invoke('employee-auth', {
          body: { action: 'logout', employeeId: employee.id }
        });
      }
      
      // Clear local storage
      localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
      
      // Notify listeners
      this._notifyListeners(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error during logout'
      };
    }
  },
  
  getCurrentEmployee(): Employee | null {
    const employeeData = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    if (!employeeData) return null;
    
    try {
      return JSON.parse(employeeData) as Employee;
    } catch (error) {
      console.error('Error parsing employee data:', error);
      return null;
    }
  },
  
  isAuthenticated(): boolean {
    return this.getCurrentEmployee() !== null;
  },
  
  hasRole(role: 'admin' | 'sales_rep' | 'manager'): boolean {
    const employee = this.getCurrentEmployee();
    return employee !== null && employee.role === role;
  },
  
  isAdmin(): boolean {
    return this.hasRole('admin');
  },
  
  // Method for auth state changes
  onAuthStateChange(callback: AuthChangeListener): () => void {
    listeners.push(callback);
    
    // Call the callback immediately with the current state
    const currentEmployee = this.getCurrentEmployee();
    callback(currentEmployee);
    
    // Return a function to unsubscribe
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  },
  
  // Initialize auth state from localStorage
  initialize(): void {
    const employee = this.getCurrentEmployee();
    this._notifyListeners(employee);
  },
  
  // Private method to notify all listeners
  _notifyListeners(employee: Employee | null): void {
    for (const listener of listeners) {
      listener(employee);
    }
  }
};
