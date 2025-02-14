import { ISale, IShipment } from "./index";

export interface IShipmentProduct {
  id: string;
  shipment_id: string;
  bill_id: string;
  created_at: string;
  updated_at?: string;
  shipment?: IShipment;
  sale?: ISale;
}
