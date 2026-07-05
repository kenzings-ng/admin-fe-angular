export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  createdAt: string;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
}
