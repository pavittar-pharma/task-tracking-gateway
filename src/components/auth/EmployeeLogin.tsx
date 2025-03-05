
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Lock, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { toast } from "sonner";
import { Employee } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export function EmployeeLogin() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [password, setPassword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchEmployees() {
      try {
        console.log("Fetching employees...");
        
        // Try to query directly to debug
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, email, role')
          .order('name');
          
        if (error) {
          console.error('Supabase error:', error);
          setError(`Failed to load employees: ${error.message}`);
          toast.error('Failed to load employees. Please try again later.');
          return;
        }
        
        console.log("Employees data:", data);
        
        if (data && data.length > 0) {
          setEmployees(data);
          setDebugInfo(null);
        } else {
          console.log("No employees found or empty data array");
          // Try to check if the table exists and has data with a raw count query
          const { count, error: countError } = await supabase
            .from('employees')
            .select('*', { count: 'exact', head: true });
            
          if (countError) {
            setDebugInfo(`Table check error: ${countError.message}`);
          } else {
            setDebugInfo(`Table exists but contains ${count || 0} rows`);
          }
          
          setError("No employees found in the database");
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        toast.error('Failed to load employees. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEmployees();
  }, []);
  
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDropdown(false);
    setPassword(""); // Reset password when changing employee
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
      const loggedInUser = await auth.login(selectedEmployee.id, password);
      
      if (loggedInUser) {
        toast.success(`Welcome, ${loggedInUser.name}!`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      
      {debugInfo && (
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md mb-4">
          <p className="text-xs text-blue-800 dark:text-blue-200">Debug info: {debugInfo}</p>
        </div>
      )}
      
      {error ? (
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-md text-center">
          <p className="text-red-600 dark:text-red-200 mb-3">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            To use the demo, we need to seed the database with sample employees.
          </p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={async () => {
              try {
                setIsLoading(true);
                const { error } = await supabase.functions.invoke('seed-database', {
                  body: { type: 'employees' }
                });
                
                if (error) {
                  toast.error(`Failed to seed database: ${error.message}`);
                } else {
                  toast.success('Database seeded successfully. Refreshing...');
                  window.location.reload();
                }
              } catch (e) {
                console.error('Seeding error:', e);
                toast.error('Failed to seed database');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Seed Database with Demo Data
          </button>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Employee Selection Dropdown */}
            <div className="relative">
              <label 
                htmlFor="employee" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Select Employee
              </label>
              <button
                type="button"
                className="relative w-full cursor-pointer rounded-md border border-input bg-white dark:bg-gray-900 py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-haspopup="listbox"
                aria-expanded={showDropdown}
              >
                {selectedEmployee ? (
                  <span className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    <span>{selectedEmployee.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({selectedEmployee.role})
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center text-gray-500">
                    <User className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    Select your name
                  </span>
                )}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </button>
              
              {showDropdown && (
                <ul
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in"
                  tabIndex={-1}
                  role="listbox"
                >
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <li
                        key={employee.id}
                        className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-100 hover:bg-pharma-100 dark:hover:bg-gray-700 ${
                          selectedEmployee?.id === employee.id ? "bg-pharma-50 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => handleSelectEmployee(employee)}
                        role="option"
                        aria-selected={selectedEmployee?.id === employee.id}
                      >
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                          <span className={`block truncate ${
                            selectedEmployee?.id === employee.id ? "font-semibold" : "font-normal"
                          }`}>
                            {employee.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({employee.role})
                          </span>
                        </div>
                        
                        {selectedEmployee?.id === employee.id && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-pharma-600 dark:text-pharma-400">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400">
                      No employees found
                    </li>
                  )}
                </ul>
              )}
            </div>
            
            {/* Password input (only shown if employee is selected) */}
            {selectedEmployee && (
              <div className="space-y-1 transition-all duration-300 ease-in-out">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 pl-10 shadow-sm focus:border-primary focus:ring-primary dark:text-white"
                    placeholder="Enter your password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  For demo: admin123, sales123, manager123
                </p>
              </div>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={!selectedEmployee || !password || isSubmitting}
              className={`group relative flex w-full justify-center rounded-md bg-pharma-600 py-2 px-4 text-sm font-medium text-white hover:bg-pharma-700 focus:outline-none focus:ring-2 focus:ring-pharma-500 focus:ring-offset-2 transition-all duration-200 ease-in-out ${
                (!selectedEmployee || !password || isSubmitting) ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
