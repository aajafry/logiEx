import { IEmployee, IShipmentProduct, IVehicle } from "./index";

export interface IShipment {
  id: string;
  shipment_id: string;
  vehicle_vin: string;
  captain_id: string;
  shipment_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
  captain?: IEmployee;
  vehicle?: IVehicle;
  items?: IShipmentProduct[];
  orders?: {
    bill_id: string;
  }[];
  existingItems?: {
    id: string;
    bill_id: string;
  }[];
}
