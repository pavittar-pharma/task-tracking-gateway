
import { Customer, Employee, LeadStatus, Order, Product, Task, UserRole, TaskStatus, TaskPriority, OrderStatus } from "./types";

// Mock Employees data
export const employees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@pharma-crm.com",
    role: "admin",
    password: "admin123",
    lastActive: new Date().toISOString(),
    created: "2023-01-15T08:00:00.000Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@pharma-crm.com",
    role: "sales_rep",
    password: "sales123",
    lastActive: new Date().toISOString(),
    created: "2023-02-10T10:30:00.000Z"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@pharma-crm.com",
    role: "manager",
    password: "manager123",
    lastActive: "2023-06-15T14:45:00.000Z",
    created: "2023-03-05T09:15:00.000Z"
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@pharma-crm.com",
    role: "sales_rep",
    password: "sales456",
    lastActive: "2023-06-14T11:20:00.000Z",
    created: "2023-04-20T13:45:00.000Z"
  }
];

// Mock Customers data
export const customers: Customer[] = [
  {
    id: "1",
    name: "Memorial Hospital",
    company: "Memorial Healthcare",
    email: "contact@memorial.org",
    phone: "555-123-4567",
    address: "123 Healthcare Ave, Medical City, MC 12345",
    lead_status: "converted",
    assigned_to: "2",
    notes: "Regular buyer of antibiotics and pain management drugs",
    created_at: "2023-02-18T09:30:00.000Z",
    updated_at: "2023-06-10T14:15:00.000Z"
  },
  {
    id: "2",
    name: "City Clinic",
    company: "City Healthcare Network",
    email: "info@cityclinic.com",
    phone: "555-987-6543",
    address: "456 Clinic St, Health District, HD 67890",
    lead_status: "in_progress",
    assigned_to: "4",
    notes: "Interested in our new diabetes management drugs",
    created_at: "2023-03-22T11:45:00.000Z",
    updated_at: "2023-06-05T10:30:00.000Z"
  },
  {
    id: "3",
    name: "Dr. Robert Chen",
    company: "Private Practice",
    email: "dr.chen@medmail.com",
    phone: "555-222-3333",
    address: "789 Doctor's Row, Physician Park, PP 54321",
    lead_status: "new_lead",
    assigned_to: "2",
    notes: "",
    created_at: "2023-05-30T15:20:00.000Z",
    updated_at: "2023-05-30T15:20:00.000Z"
  },
  {
    id: "4",
    name: "Wellness Pharmacy",
    company: "Wellness Group",
    email: "orders@wellnesspharmacy.com",
    phone: "555-444-5555",
    address: "101 Wellness Blvd, Healthy Heights, HH 98765",
    lead_status: "converted",
    assigned_to: "4",
    notes: "Regular customer for various medicines",
    created_at: "2023-01-05T08:30:00.000Z",
    updated_at: "2023-06-12T09:45:00.000Z"
  }
];

// Mock Products data
export const products: Product[] = [
  {
    id: "1",
    product_name: "PainRelief Plus",
    stock_quantity: 120,
    price: 45.99,
    low_stock_threshold: 30,
    low_stock_alert: false,
    created_at: "2023-01-10T08:00:00.000Z",
    updated_at: "2023-06-01T10:15:00.000Z"
  },
  {
    id: "2",
    product_name: "DiabeCare Tablets",
    stock_quantity: 85,
    price: 58.75,
    low_stock_threshold: 25,
    low_stock_alert: false,
    created_at: "2023-02-15T09:30:00.000Z",
    updated_at: "2023-06-05T14:20:00.000Z"
  },
  {
    id: "3",
    product_name: "HeartGuard",
    stock_quantity: 62,
    price: 75.50,
    low_stock_threshold: 20,
    low_stock_alert: false,
    created_at: "2023-03-05T11:45:00.000Z",
    updated_at: "2023-06-10T16:30:00.000Z"
  },
  {
    id: "4",
    product_name: "ImmunoBoost",
    stock_quantity: 18,
    price: 32.25,
    low_stock_threshold: 30,
    low_stock_alert: true,
    created_at: "2023-04-20T10:00:00.000Z",
    updated_at: "2023-06-12T15:10:00.000Z"
  }
];

// Mock Orders data
export const orders: Order[] = [
  {
    id: "1",
    customer_id: "1",
    assigned_employee: "2",
    total_amount: 1674.80,
    status: "delivered",
    created_at: "2023-05-15T10:30:00.000Z",
    updated_at: "2023-05-18T16:45:00.000Z"
  },
  {
    id: "2",
    customer_id: "4",
    assigned_employee: "4",
    total_amount: 881.25,
    status: "dispatched",
    created_at: "2023-06-05T09:15:00.000Z",
    updated_at: "2023-06-06T11:30:00.000Z"
  },
  {
    id: "3",
    customer_id: "2",
    assigned_employee: "2",
    total_amount: 967.50,
    status: "pending",
    created_at: "2023-06-12T14:45:00.000Z",
    updated_at: "2023-06-12T14:45:00.000Z"
  }
];

// Mock Tasks data
export const tasks: Task[] = [
  {
    id: "1",
    task_description: "Follow up with Memorial Hospital",
    assigned_to: "2",
    priority: "high",
    status: "completed",
    due_date: "2023-06-10T17:00:00.000Z",
    created_at: "2023-06-05T09:30:00.000Z",
    completed_at: "2023-06-10T15:45:00.000Z"
  },
  {
    id: "2",
    task_description: "Send DiabeCare samples to City Clinic",
    assigned_to: "4",
    priority: "medium",
    status: "in_progress",
    due_date: "2023-06-20T17:00:00.000Z",
    created_at: "2023-06-08T11:15:00.000Z"
  },
  {
    id: "3",
    task_description: "Inventory check for ImmunoBoost",
    assigned_to: "3",
    priority: "high",
    status: "in_progress",
    due_date: "2023-06-18T17:00:00.000Z",
    created_at: "2023-06-14T13:45:00.000Z"
  },
  {
    id: "4",
    task_description: "Call Dr. Chen to introduce new products",
    assigned_to: "2",
    priority: "low",
    status: "in_progress",
    due_date: "2023-06-25T17:00:00.000Z",
    created_at: "2023-06-15T09:00:00.000Z"
  }
];

// Helper function to get lead status label
export function getLeadStatusLabel(status: LeadStatus): string {
  switch (status) {
    case "new_lead": return "New Lead";
    case "in_progress": return "In Progress";
    case "converted": return "Converted";
    default: return "Unknown";
  }
}

// Helper function to get employee role label
export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin": return "Administrator";
    case "sales_rep": return "Sales Representative";
    case "manager": return "Manager";
    default: return "Unknown";
  }
}

// Helper function to get employee by ID
export function getEmployeeById(id: string): Employee | undefined {
  return employees.find(employee => employee.id === id);
}

// Helper function to get customer by ID
export function getCustomerById(id: string): Customer | undefined {
  return customers.find(customer => customer.id === id);
}

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}
