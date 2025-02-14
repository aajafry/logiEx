import { ICustomer, ISaleProduct, IShipmentProduct } from "./index";

export interface ISale {
  id: string;
  bill_id: string;
  inventory: string;
  customer_id: string;
  shipping_address: string;
  adjustment?: number;
  total_price: string;
  status: string;
  sale_date: string;
  created_at: string;
  updated_at?: string;
  customer?: ICustomer;
  // inventory?: IInventory;
  products?: Partial<ISaleProduct>[] | ISaleProduct[];
  existingProducts?:
    | {
        id: string;
        product: string;
        quantity: number;
        unit_price: number;
        discount?: number;
      }[]
    | ISaleProduct[];
  shipments?: IShipmentProduct[];
}
