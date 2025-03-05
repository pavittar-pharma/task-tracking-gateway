
// User roles for our CRM
export type UserRole = "admin" | "sales_rep" | "manager";

// User/Employee type
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  lastActive?: string;
  created?: string;
}

// Customer lead status
export type LeadStatus = "new_lead" | "in_progress" | "converted";

// Customer type
export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  lead_status: LeadStatus;
  assigned_to: string; // Employee ID
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Order status
export type OrderStatus = "pending" | "dispatched" | "delivered";

// Order type
export interface Order {
  id: string;
  customer_id: string;
  assigned_employee: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

// Product in order
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

// Product/Inventory item
export interface Product {
  id: string;
  product_name: string;
  stock_quantity: number;
  price: number;
  low_stock_threshold: number;
  low_stock_alert: boolean;
  created_at: string;
  updated_at: string;
}

// Task priority levels
export type TaskPriority = "low" | "medium" | "high";

// Task status
export type TaskStatus = "in_progress" | "completed" | "missed";

// Task type
export interface Task {
  id: string;
  task_description: string;
  assigned_to: string; // Employee ID
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  completed_at?: string;
}

// Activity log type
export interface ActivityLog {
  id: string;
  employee_id: string;
  action: string;
  timestamp: string;
}
