export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  planId: string;
  planName: string;
  planPrice: number;
  mealTypes: string[];
  deliveryDays: string[];
  allergies?: string;
  totalPrice: number;
  status: "active" | "paused" | "cancelled";
  createdAt: string;
  pausedFrom?: string;
  pausedTo?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface DashboardMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  subscriptionGrowth: number;
  totalActiveSubscriptions: number;
}
