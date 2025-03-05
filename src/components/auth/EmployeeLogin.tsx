
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
  
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, email, role')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setEmployees(data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
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
                {employees.map((employee) => (
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
                ))}
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
                Test accounts: admin/admin123, sales/sales123, manager/manager123
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
    </div>
  );
}
