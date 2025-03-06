
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  Home, 
  LogOut, 
  Menu, 
  Package, 
  ShoppingCart, 
  Users, 
  X 
} from "lucide-react";
import { authService } from "@/lib/authService";
import { Employee } from "@/lib/types";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiresAdmin?: boolean;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Employees", href: "/employees", icon: Users, requiresAdmin: true },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = authService.onAuthStateChange((employee) => {
      setUser(employee);
      
      if (!employee) {
        // Redirect to login if not authenticated
        navigate("/login");
      }
    });
    
    // Initialize auth state from session storage
    authService.initialize();
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);
  
  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      toast.success("You have been logged out");
      navigate("/login");
    } else {
      toast.error(result.message || "Logout failed");
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
      </div>
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-pharma-600 dark:text-pharma-400">
              PharmaSync
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="px-2 py-4 space-y-1 overflow-y-auto">
            {navigation
              .filter(item => !item.requiresAdmin || authService.isAdmin())
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-pharma-50 dark:hover:bg-gray-700 hover:text-pharma-600 dark:hover:text-pharma-400 transition-colors duration-200"
                >
                  <item.icon
                    className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-pharma-600 dark:group-hover:text-pharma-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
          </nav>
          
          {/* User profile section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-pharma-600 dark:bg-pharma-700 flex items-center justify-center text-white">
                  {user.name.substring(0, 1)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 lg:ml-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome, {user.name}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
