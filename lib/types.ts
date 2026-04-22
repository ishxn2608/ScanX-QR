import { Timestamp } from "firebase/firestore";

export interface UserData {
  id: string;
  email: string;
  name: string;
  mobileNumber: string;
  role: "vendor" | "customer";
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  approvedAt?: Timestamp | null;
  rejectedAt?: Timestamp | null;
}

export interface Shop {
  id: string;
  shopName: string;
  upiId: string;
  token: string;
  verified: boolean;
  imageUrl: string;
  ownerId: string;
  createdAt: Timestamp;
  verifiedAt?: Timestamp | null;
  lastTokenRefresh?: Timestamp | null;
  enabled: boolean;
}

export interface Transaction {
  id: string;
  shopId: string;
  shopName: string;
  amount: number;
  customerId?: string;
  timestamp: Timestamp;
  status: "success" | "pending" | "failed";
}
