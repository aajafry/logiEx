import {
  IEmployee,
  IInventoryProduct,
  IPurchase,
  ISale,
  ITransfer,
} from "./index";

export interface IInventory {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  address: string;
  created_at: string;
  updated_at?: string;
  inventories?: IInventoryProduct[];
  purchases?: IPurchase[];
  sales?: ISale[];
  // saleProducts?: ISaleProduct[];
  employees?: IEmployee[];
  source?: ITransfer[];
  destination?: ITransfer[];
}
