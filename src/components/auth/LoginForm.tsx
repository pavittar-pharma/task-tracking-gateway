
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
  const navigate = useNavigate();
  
  // Check if already logged in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await authService.login(username, password);
      
      if (result.success && result.employee) {
        toast.success(`Welcome, ${result.employee.name}!`);
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
        setPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mx-auto w-full max-w-md space-y-8 glass-panel p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to Pavittar Pharma CRM
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your username and password
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>A custom build by Rishul Chanana</p>
      </div>
    </div>
  );
}
