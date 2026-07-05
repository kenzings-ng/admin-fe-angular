/** Response from POST /upload/image. */
export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  mimetype: string;
  size: number;
}

/** Image upload constraints enforced by the API (mirrored client-side). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;
