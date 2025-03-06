
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Container } from "@/components/ui/container";
import { authService } from "@/lib/authService";
import { useNavigate } from "react-router-dom";
import { customers, orders, tasks } from "@/lib/data";
import { BarChart3, Calendar, ClipboardList, DollarSign, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
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
          <div className="animate-pulse text-purple-600 dark:text-purple-400">
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
            icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            change={{ value: `+${newCustomers} new`, isPositive: true }}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700"
          />
          
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            change={{ value: `${pendingOrders} pending`, isPositive: pendingOrders > 0 }}
            className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-700"
          />
          
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />}
            change={{ value: "8.2%", isPositive: true }}
            className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700"
          />
          
          <StatCard
            title="Tasks"
            value={`${completedTasks}/${tasks.length}`}
            icon={<ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            change={{ 
              value: `${pendingTasks} pending`, 
              isPositive: pendingTasks < tasks.length / 2 
            }}
            className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700"
          />
        </div>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tasks panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Tasks
              </h2>
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === "in_progress")
                .slice(0, 4)
                .map((task, i) => (
                  <div 
                    key={task.id} 
                    className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
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
            <button className="w-full mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              View all tasks →
            </button>
          </div>

          {/* Recent Orders panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" 
                        : order.status === "dispatched"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              View all orders →
            </button>
          </div>
          
          {/* New Leads panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Leads
              </h2>
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-3">
              {customers
                .filter(customer => customer.lead_status === "new_lead")
                .map((customer) => (
                  <div 
                    key={customer.id} 
                    className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {customer.company || "Individual"}
                      </p>
                      <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        New Lead
                      </div>
                    </div>
                  </div>
                ))}
              {customers.filter(customer => customer.lead_status === "new_lead").length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-3 text-center">
                  No new leads at the moment
                </p>
              )}
            </div>
            <button className="w-full mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              View all customers →
            </button>
          </div>
        </div>

        {/* Calendar Preview */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Calendar
            </h2>
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-medium text-gray-500 dark:text-gray-400 py-2">{day}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
              const hasTask = tasks.some(task => {
                const taskDate = new Date(task.due_date);
                return taskDate.getDate() === date && taskDate.getMonth() === new Date().getMonth();
              });
              
              return (
                <div 
                  key={date} 
                  className={`py-2 rounded-md ${
                    date === new Date().getDate() 
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 font-semibold" 
                      : hasTask
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  {date}
                  {hasTask && (
                    <div className="w-1 h-1 rounded-full bg-blue-500 mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
