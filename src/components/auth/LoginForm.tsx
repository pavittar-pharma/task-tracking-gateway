
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/lib/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting credentials:", { username, password });
      const result = await authService.login(username, password);
      console.log("Login result:", result);
      
      if (result.status === 'success' && result.employee) {
        toast.success(`Welcome, ${result.employee.name}!`);
        navigate("/dashboard");
      } else {
        setErrorMessage(result.error || "Invalid credentials");
        toast.error(result.error || "Login failed");
        setPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md space-y-6 glass-panel p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to Pavittar Pharma CRM
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your username and password
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Username input */}
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          {/* Password input */}
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
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <div className="text-gray-500">Try these default credentials:</div>
        <div className="text-gray-600 mt-1">
          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">admin / admin123</code> or <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">sales / sales123</code>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>A custom build by Rishul Chanana</p>
      </div>
    </div>
  );
}
