
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
  
  logout(): void {
    // Call the logout endpoint (async, but we don't need to wait)
    const employee = this.getCurrentEmployee();
    if (employee) {
      supabase.functions.invoke('employee-auth', {
        body: { action: 'logout', employeeId: employee.id }
      }).catch(error => {
        console.error('Error logging out:', error);
      });
    }
    
    // Clear local storage
    localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
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
  }
};
