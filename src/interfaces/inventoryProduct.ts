// import { IInventory, IProduct, IPurchase } from "./index";

export interface IInventoryProduct {
  id: string;
  mr_id: string;
  inventory: string;
  product: string;
  quantity: number;
  created_at: string;
  updated_at?: string;
  // purchase?: IPurchase;
  // inventory?: IInventory;
  // product?: IProduct;
}
