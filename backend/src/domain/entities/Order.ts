export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string; // Snapshot
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  userName?: string;
  userEmail?: string;
}
