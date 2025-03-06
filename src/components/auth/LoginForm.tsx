
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Employee } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [password, setPassword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if already logged in
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
      return;
    }
    
    // Fetch employees for the dropdown
    fetchEmployees();
  }, [navigate]);
  
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching employees...");
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, email, role')
        .order('name');
        
      if (error) {
        console.error('Supabase error:', error);
        setError(`Failed to load employees: ${error.message}`);
        toast.error('Failed to load employees');
        return;
      }
      
      console.log("Employees data:", data);
      
      if (data && data.length > 0) {
        setEmployees(data);
        setError(null);
      } else {
        console.log("No employees found or empty data array");
        setError("No employees found in the database");
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDropdown(false);
    setPassword("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Attempting to login with employee ID: ${selectedEmployee.id}`);
      const result = await authService.login(selectedEmployee.id, password);
      
      if (result.success && result.employee) {
        toast.success(`Welcome, ${result.employee.name}!`);
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Invalid password");
        setPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSeedDatabase = async () => {
    try {
      setIsLoading(true);
      const result = await authService.seedEmployees();
      
      if (result.success) {
        toast.success(result.message || 'Database seeded successfully');
        // Refresh employee list
        await fetchEmployees();
      } else {
        toast.error(result.message || 'Failed to seed database');
      }
    } catch (e) {
      console.error('Seeding error:', e);
      toast.error('Failed to seed database');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-md space-y-8 glass-panel p-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto w-full max-w-md space-y-8 glass-panel p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to PharmaSync
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Select your name and enter your password
        </p>
      </div>
      
      {error ? (
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-md text-center">
          <p className="text-red-600 dark:text-red-200 mb-3">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            To use the demo, we need to seed the database with sample employees
          </p>
          <Button 
            onClick={handleSeedDatabase}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Seeding...' : 'Seed Database with Demo Data'}
          </Button>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Employee Selection */}
            <div>
              <Label htmlFor="employee" className="block text-sm font-medium mb-1">
                Select Employee
              </Label>
              <div className="relative">
                <button
                  type="button"
                  id="employee"
                  className="relative w-full flex items-center justify-between border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedEmployee ? (
                    <span className="flex items-center">
                      <span>{selectedEmployee.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({selectedEmployee.role})
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select your name</span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                
                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-md">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {employees.map((employee) => (
                        <li
                          key={employee.id}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                            selectedEmployee?.id === employee.id ? "bg-accent text-accent-foreground" : ""
                          }`}
                          onClick={() => handleSelectEmployee(employee)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 opacity-70" />
                            <span>{employee.name}</span>
                            <span className="ml-2 text-xs opacity-70">
                              ({employee.role})
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Password input */}
            {selectedEmployee && (
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  For demo: admin123, sales123, manager123
                </p>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={!selectedEmployee || !password || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      )}
    </div>
  );
}
