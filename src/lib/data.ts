
import { Customer, Employee, LeadStatus, Order, Product, Task, UserRole } from "./types";

// Mock Employees data
export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@pharma-crm.com",
    role: "admin",
    password: "admin123",
    lastActive: new Date().toISOString(),
    created: "2023-01-15T08:00:00.000Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@pharma-crm.com",
    role: "sales",
    password: "sales123",
    lastActive: new Date().toISOString(),
    created: "2023-02-10T10:30:00.000Z"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@pharma-crm.com",
    role: "manager",
    password: "manager123",
    lastActive: "2023-06-15T14:45:00.000Z",
    created: "2023-03-05T09:15:00.000Z"
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@pharma-crm.com",
    role: "sales",
    password: "sales456",
    lastActive: "2023-06-14T11:20:00.000Z",
    created: "2023-04-20T13:45:00.000Z"
  }
];

// Mock Customers data
export const customers: Customer[] = [
  {
    id: 1,
    name: "Memorial Hospital",
    company: "Memorial Healthcare",
    email: "contact@memorial.org",
    phone: "555-123-4567",
    address: "123 Healthcare Ave, Medical City, MC 12345",
    leadStatus: "converted",
    assignedTo: 2,
    notes: "Regular buyer of antibiotics and pain management drugs",
    created: "2023-02-18T09:30:00.000Z",
    lastContact: "2023-06-10T14:15:00.000Z"
  },
  {
    id: 2,
    name: "City Clinic",
    company: "City Healthcare Network",
    email: "info@cityclinic.com",
    phone: "555-987-6543",
    address: "456 Clinic St, Health District, HD 67890",
    leadStatus: "in-progress",
    assignedTo: 4,
    notes: "Interested in our new diabetes management drugs",
    created: "2023-03-22T11:45:00.000Z",
    lastContact: "2023-06-05T10:30:00.000Z"
  },
  {
    id: 3,
    name: "Dr. Robert Chen",
    company: "Private Practice",
    email: "dr.chen@medmail.com",
    phone: "555-222-3333",
    address: "789 Doctor's Row, Physician Park, PP 54321",
    leadStatus: "new",
    assignedTo: 2,
    created: "2023-05-30T15:20:00.000Z"
  },
  {
    id: 4,
    name: "Wellness Pharmacy",
    company: "Wellness Group",
    email: "orders@wellnesspharmacy.com",
    phone: "555-444-5555",
    address: "101 Wellness Blvd, Healthy Heights, HH 98765",
    leadStatus: "converted",
    assignedTo: 4,
    notes: "Regular customer for various medicines",
    created: "2023-01-05T08:30:00.000Z",
    lastContact: "2023-06-12T09:45:00.000Z"
  }
];

// Mock Products data
export const products: Product[] = [
  {
    id: 1,
    name: "PainRelief Plus",
    description: "Advanced pain relief medication",
    price: 45.99,
    stock: 120,
    lowStockThreshold: 30
  },
  {
    id: 2,
    name: "DiabeCare Tablets",
    description: "Diabetes management medication",
    price: 58.75,
    stock: 85,
    lowStockThreshold: 25
  },
  {
    id: 3,
    name: "HeartGuard",
    description: "Cardiovascular health medicine",
    price: 75.50,
    stock: 62,
    lowStockThreshold: 20
  },
  {
    id: 4,
    name: "ImmunoBoost",
    description: "Immune system enhancer",
    price: 32.25,
    stock: 18,
    lowStockThreshold: 30
  }
];

// Mock Orders data
export const orders: Order[] = [
  {
    id: 1,
    customerId: 1,
    products: [
      { productId: 1, quantity: 20, price: 45.99 },
      { productId: 3, quantity: 10, price: 75.50 }
    ],
    totalAmount: 1674.80,
    status: "delivered",
    created: "2023-05-15T10:30:00.000Z",
    updated: "2023-05-18T16:45:00.000Z"
  },
  {
    id: 2,
    customerId: 4,
    products: [
      { productId: 2, quantity: 15, price: 58.75 }
    ],
    totalAmount: 881.25,
    status: "dispatched",
    created: "2023-06-05T09:15:00.000Z",
    updated: "2023-06-06T11:30:00.000Z"
  },
  {
    id: 3,
    customerId: 2,
    products: [
      { productId: 4, quantity: 30, price: 32.25 }
    ],
    totalAmount: 967.50,
    status: "pending",
    created: "2023-06-12T14:45:00.000Z",
    updated: "2023-06-12T14:45:00.000Z"
  }
];

// Mock Tasks data
export const tasks: Task[] = [
  {
    id: 1,
    title: "Follow up with Memorial Hospital",
    description: "Discuss new product line and get feedback on current supplies",
    assignedTo: 2,
    priority: "high",
    status: "completed",
    dueDate: "2023-06-10T17:00:00.000Z",
    created: "2023-06-05T09:30:00.000Z",
    updated: "2023-06-10T15:45:00.000Z"
  },
  {
    id: 2,
    title: "Send DiabeCare samples to City Clinic",
    description: "Prepare and deliver sample package of our new diabetes medication",
    assignedTo: 4,
    priority: "medium",
    status: "in-progress",
    dueDate: "2023-06-20T17:00:00.000Z",
    created: "2023-06-08T11:15:00.000Z",
    updated: "2023-06-15T10:30:00.000Z"
  },
  {
    id: 3,
    title: "Inventory check for ImmunoBoost",
    description: "Verify current stock and place order if below threshold",
    assignedTo: 3,
    priority: "high",
    status: "pending",
    dueDate: "2023-06-18T17:00:00.000Z",
    created: "2023-06-14T13:45:00.000Z",
    updated: "2023-06-14T13:45:00.000Z"
  },
  {
    id: 4,
    title: "Call Dr. Chen to introduce new products",
    description: "Schedule a meeting to discuss our new product line",
    assignedTo: 2,
    priority: "low",
    status: "pending",
    dueDate: "2023-06-25T17:00:00.000Z",
    created: "2023-06-15T09:00:00.000Z",
    updated: "2023-06-15T09:00:00.000Z"
  }
];

// Helper function to get lead status label
export function getLeadStatusLabel(status: LeadStatus): string {
  switch (status) {
    case "new": return "New Lead";
    case "in-progress": return "In Progress";
    case "converted": return "Converted";
    default: return "Unknown";
  }
}

// Helper function to get employee role label
export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin": return "Administrator";
    case "sales": return "Sales Representative";
    case "manager": return "Manager";
    default: return "Unknown";
  }
}

// Helper function to get employee by ID
export function getEmployeeById(id: number): Employee | undefined {
  return employees.find(employee => employee.id === id);
}

// Helper function to get customer by ID
export function getCustomerById(id: number): Customer | undefined {
  return customers.find(customer => customer.id === id);
}

// Helper function to get product by ID
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}
