import { IInventoryProduct, IPurchaseProduct, ISaleProduct } from "./index";

export interface IPurchase {
  id: string;
  vendor: string;
  inventory: string;
  mr_id: string;
  adjustment: number;
  total_price: number;
  purchase_date: string;
  created_at: string;
  updated_at?: string;
  // vendor?: IVendor;
  // inventory?: IInventory;
  products?: Partial<IPurchaseProduct>[] | IPurchaseProduct[];
  existingProducts?:
    | {
        id: string;
        product: string;
        quantity: number;
        unit_price: number;
        discount?: number;
      }[]
    | IPurchaseProduct[];
  storages?: IInventoryProduct[];
  sales?: ISaleProduct[];
}
