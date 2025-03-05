
// User roles for our CRM
export type UserRole = "admin" | "sales" | "manager";

// User/Employee type
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  lastActive?: string;
  created: string;
}

// Customer lead status
export type LeadStatus = "new" | "in-progress" | "converted";

// Customer type
export interface Customer {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  leadStatus: LeadStatus;
  assignedTo: number; // Employee ID
  notes?: string;
  created: string;
  lastContact?: string;
}

// Order status
export type OrderStatus = "pending" | "dispatched" | "delivered";

// Order type
export interface Order {
  id: number;
  customerId: number;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  created: string;
  updated: string;
}

// Product in order
export interface OrderProduct {
  productId: number;
  quantity: number;
  price: number;
}

// Product/Inventory item
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

// Task priority levels
export type TaskPriority = "low" | "medium" | "high";

// Task status
export type TaskStatus = "pending" | "in-progress" | "completed" | "missed";

// Task type
export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // Employee ID
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  created: string;
  updated: string;
}
