import { ISale } from "./index";

export interface ICustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  orders?: ISale[];
}
