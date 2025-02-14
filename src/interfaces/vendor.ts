import { IPurchase } from "./index";

export interface IVendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
  sales?: IPurchase[];
}
