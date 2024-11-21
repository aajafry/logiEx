import { RailSymbol as Vehicle } from "lucide-react";
import {
  BiSolidCategory as Category,
  BiSolidPurchaseTag as Purchase,
  BiTransferAlt as Transfer,
} from "react-icons/bi";
import {
  FaUsers as Customer,
  FaGift as Product,
  FaFileInvoiceDollar as Sale,
  FaShippingFast as Shipment,
  FaUserAstronaut as Supervisors,
  FaStore as Vendor,
} from "react-icons/fa";
import { GiCaptainHatProfile as Captain } from "react-icons/gi";
import { GrUserWorker as Employee } from "react-icons/gr";
import { MdInventory as Inventory } from "react-icons/md";

export const adminMenus = [
  {
    title: "Vendors",
    url: "/admin/vendors",
    icon: Vendor,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Category,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Product,
  },
  {
    title: "Purchases",
    url: "/admin/purchases",
    icon: Purchase,
  },
  {
    title: "Inventories",
    url: "/admin/inventories",
    icon: Inventory,
  },
  {
    title: "Supervisors",
    url: "/admin/inventories/supervisors",
    icon: Supervisors,
  },
  {
    title: "Transfers",
    url: "/admin/transfers",
    icon: Transfer,
  },
  {
    title: "Sales",
    url: "/admin/sales",
    icon: Sale,
  },
  {
    title: "Shipments",
    url: "/admin/shipments",
    icon: Shipment,
  },
  {
    title: "Vehicles",
    url: "/admin/vehicles",
    icon: Vehicle,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: Employee,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Customer,
  },
];

export const procurementManagerMenus = [
  {
    title: "Vendors",
    url: "/procurement-manager/vendors",
    icon: Vendor,
  },
  {
    title: "Categories",
    url: "/procurement-manager/categories",
    icon: Category,
  },
  {
    title: "Products",
    url: "/procurement-manager/products",
    icon: Product,
  },
  {
    title: "Purchases",
    url: "/procurement-manager/purchases",
    icon: Purchase,
  },
  {
    title: "Inventories",
    url: "/procurement-manager/inventories",
    icon: Inventory,
  },
];

export const fleetManagerMenus = [
  {
    title: "Vehicles",
    url: "/fleet-manager/vehicles",
    icon: Vehicle,
  },
  {
    title: "Captains",
    url: "/fleet-manager/captains",
    icon: Captain,
  },
  {
    title: "Shipments",
    url: "/fleet-manager/shipments",
    icon: Shipment,
  },
  {
    title: "Sales",
    url: "/fleet-manager/sales",
    icon: Sale,
  },
];

export const inventoryManagerMenus = [
  {
    title: "Vendors",
    url: "/inventory-manager/vendors",
    icon: Vendor,
  },
  {
    title: "Categories",
    url: "/inventory-manager/categories",
    icon: Category,
  },
  {
    title: "Products",
    url: "/inventory-manager/products",
    icon: Product,
  },
  {
    title: "Purchases",
    url: "/inventory-manager/purchases",
    icon: Purchase,
  },
  {
    title: "Inventories",
    url: "/inventory-manager/inventories",
    icon: Inventory,
  },
  {
    title: "Supervisors",
    url: "/inventory-manager/inventories/supervisors",
    icon: Supervisors,
  },
  {
    title: "Transfers",
    url: "/inventory-manager/transfers",
    icon: Transfer,
  },
  {
    title: "Sales",
    url: "/inventory-manager/sales",
    icon: Sale,
  },
  {
    title: "Shipments",
    url: "/inventory-manager/shipments",
    icon: Shipment,
  },
  {
    title: "Vehicles",
    url: "/inventory-manager/vehicles",
    icon: Vehicle,
  },
  {
    title: "Employees",
    url: "/inventory-manager/employees",
    icon: Employee,
  },
  {
    title: "Customers",
    url: "/inventory-manager/customers",
    icon: Customer,
  },
];

export const inventoryInChargeMenus = [
  {
    title: "Categories",
    url: "/inventory-in-charge/categories",
    icon: Category,
  },
  {
    title: "Products",
    url: "/inventory-in-charge/products",
    icon: Product,
  },
  {
    title: "Inventories",
    url: "/inventory-in-charge/inventory",
    icon: Inventory,
  },
  {
    title: "Transfers",
    url: "/inventory-in-charge/transfers",
    icon: Transfer,
  },
  {
    title: "Sales",
    url: "/inventory-in-charge/sales",
    icon: Sale,
  },
  {
    title: "Shipments",
    url: "/inventory-in-charge/shipments",
    icon: Shipment,
  },
  {
    title: "Vehicles",
    url: "/inventory-in-charge/vehicles",
    icon: Vehicle,
  },
  {
    title: "Customers",
    url: "/inventory-in-charge/customers",
    icon: Customer,
  },
];

export const CaptainMenus = [
  {
    title: "Shipments",
    url: "/captain/shipments",
    icon: Shipment,
  },
  {
    title: "Vehicles",
    url: "/captain/vehicles",
    icon: Vehicle,
  },
];
