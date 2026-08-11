export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  /** Bullet points shown under "Details & Care" on the storefront PDP. */
  details?: string[];
  /** Available sizes; a non-empty apparel-sized list switches the storefront's Size & Fit tab to the size chart. */
  sizes?: string[];
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
  details?: string[];
  sizes?: string[];
}

/** Payload for updating a product (PUT /products/:id) — all fields optional. */
export type UpdateProductPayload = Partial<CreateProductPayload>;
