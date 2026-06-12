export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category: string;
  glbUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
