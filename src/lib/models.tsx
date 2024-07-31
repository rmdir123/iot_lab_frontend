export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  description: string;
  summary: string;
  booktype: string;
}

export interface Coffee {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  order_id: number;
}

export interface OrderCoffee {
  id: number;
  order_id: number;
  coffee_id: number;
  quantity: number;
  total: number;
}
