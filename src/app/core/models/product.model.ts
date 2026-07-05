export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a product (POST /products). */
export interface CreateProductPayload {
  name: string;
  price: number;
  stock?: number;
  image?: string;
  description?: string;
}

/** Payload for updating a product (PUT /products/:id) — all fields optional. */
export type UpdateProductPayload = Partial<CreateProductPayload>;
