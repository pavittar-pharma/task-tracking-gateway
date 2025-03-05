import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("id, name, email, role")
          .order("name");

        if (error) {
          setError(`Failed to load employees: ${error.message}`);
          toast.error("Failed to load employees. Please try again later.");
          return;
        }

        if (data && data.length > 0) {
          setEmployees(data);
        } else {
          setError("No employees found in the database");
        }
      } catch (error) {
        setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
        toast.error("Failed to load employees. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployees();
  }, []);

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
      const loggedInUser = await auth.login(selectedEmployee.id, password);

      if (loggedInUser) {
        toast.success(`Welcome, ${loggedInUser.name}!`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBypassLogin = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }
    toast.success(`Bypassing login for ${selectedEmployee.name}`);
    navigate("/dashboard");
  };

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  return (
    <div>
      <h1>Sign in to PharmaSync</h1>
      <p>Select your name and enter your password</p>

      <div>
        <button onClick={() => setShowDropdown(!showDropdown)}>
          {selectedEmployee ? selectedEmployee.name : "Select Employee"}
        </button>
        {showDropdown && (
          <ul>
            {employees.map((employee) => (
              <li key={employee.id} onClick={() => handleSelectEmployee(employee)}>
                {employee.name} ({employee.role})
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedEmployee && (
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
      )}

      <button onClick={handleSubmit} disabled={!selectedEmployee || !password || isSubmitting}>
        Sign in
      </button>
      <button onClick={handleBypassLogin} disabled={!selectedEmployee}>
        Bypass Login
      </button>
    </div>
  );
}
