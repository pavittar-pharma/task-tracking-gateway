
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Container } from "@/components/ui/container";
import { auth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { customers, orders, tasks } from "@/lib/data";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Calculate metrics
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => c.lead_status === "new_lead").length;
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  
  const pendingTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <div className="animate-pulse text-pharma-600 dark:text-pharma-400">
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Container className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard Overview
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={<Users className="h-6 w-6 text-pharma-600 dark:text-pharma-400" />}
            change={{ value: `+${newCustomers} new`, isPositive: true }}
          />
          
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart className="h-6 w-6 text-pharma-600 dark:text-pharma-400" />}
            change={{ value: `${pendingOrders} pending`, isPositive: pendingOrders > 0 }}
          />
          
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-pharma-600 dark:text-pharma-400" />}
            change={{ value: "8.2%", isPositive: true }}
          />
          
          <StatCard
            title="Tasks"
            value={`${completedTasks}/${tasks.length}`}
            icon={<BarChart3 className="h-6 w-6 text-pharma-600 dark:text-pharma-400" />}
            change={{ 
              value: `${pendingTasks} pending`, 
              isPositive: pendingTasks < tasks.length / 2 
            }}
          />
        </div>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activities panel (placeholder) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-pharma-100 dark:bg-gray-700 flex items-center justify-center text-pharma-600 dark:text-pharma-400 mr-4">
                    {i % 3 === 0 && <Users className="h-5 w-5" />}
                    {i % 3 === 1 && <ShoppingCart className="h-5 w-5" />}
                    {i % 3 === 2 && <BarChart3 className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {i % 3 === 0 && "New customer added"}
                      {i % 3 === 1 && "Order status updated"}
                      {i % 3 === 2 && "Task completed"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tasks panel (placeholder) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks
            </h2>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === "in_progress")
                .slice(0, 4)
                .map((task, i) => (
                  <div 
                    key={task.id} 
                    className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.task_description}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high" 
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button className="w-full mt-4 text-sm text-pharma-600 dark:text-pharma-400 hover:text-pharma-700 dark:hover:text-pharma-300 font-medium">
              View all tasks →
            </button>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
