export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: any; // Populated product details for view layer
}

export interface Cart {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalPrice?: number; // Frontend contract alias
  updatedAt?: Date;
}
