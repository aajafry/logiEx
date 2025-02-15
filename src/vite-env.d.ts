/// <reference types="vite/client" />

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_AUTH: string;
  readonly VITE_USERS: string;
  readonly VITE_CUSTOMERS: string;
  readonly VITE_VEHICLES: string;
  readonly VITE_VENDORS: string;
  readonly VITE_INVENTORIES: string;
  readonly VITE_CATEGORIES: string;
  readonly VITE_PRODUCTS: string;
  readonly VITE_INVENTORY_EMPLOYMENTS: string;
  readonly VITE_PURCHASES: string;
  readonly VITE_PURCHASE_PRODUCTS: string;
  readonly VITE_SALES: string;
  readonly VITE_SALE_PRODUCTS: string;
  readonly VITE_TRANSFERS: string;
  readonly VITE_TRANSFER_PRODUCTS: string;
  readonly VITE_SHIPMENTS: string;
  readonly VITE_SHIPMENT_PRODUCTS: string;
  readonly VITE_INVENTORY_PRODUCTS: string;
  readonly VITE_CLOUDINARY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
