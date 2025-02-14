import { ITransferProduct } from "./index";

export interface ITransfer {
  id: string;
  trf_id: string;
  source_inventory: string;
  destination_inventory: string;
  transfer_date: string;
  created_at: string;
  updated_at?: string;
  // source?: IInventory;
  // destination?: IInventory;
  products?: Partial<ITransferProduct>[] | ITransferProduct[];
  existingProducts?:
    | {
        id: string;
        mr_id: string;
        product: string;
        quantity: number;
      }[]
    | ITransferProduct[];
}
