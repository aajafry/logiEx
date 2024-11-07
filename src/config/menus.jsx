import { RailSymbol as Vehicle } from "lucide-react";
import {
  FaGift as Product,
  FaStore as Vendor,
  FaFileInvoiceDollar as Sale,
  FaShippingFast as Shipment,
  FaUserAstronaut as Supervisors,
  FaUsers as Customer,
} from "react-icons/fa";
import { GrUserWorker as Employee } from "react-icons/gr";
import { GiCaptainHatProfile as Captain } from "react-icons/gi";
import {
  BiSolidCategory as Category,
  BiSolidPurchaseTag as Purchase,
  BiTransferAlt as Transfer,
} from "react-icons/bi";
import {
  MdDashboard as Dashboard,
  MdInventory as Inventory,
} from "react-icons/md";
import { TbMessageReportFilled as Report } from "react-icons/tb";

export const adminMenus = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Dashboard,
  },
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
  {
    title: "Reports",
    url: "/admin/reports",
    icon: Report,
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
];

export const inventoryManagerMenus = [
  {
    title: "Inventories",
    url: "/inventory-manager/inventories",
    icon: Inventory,
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
    title: "Supervisors",
    url: "/inventory-manager/supervisors",
    icon: Supervisors,
  },
  {
    title: "Customers",
    url: "/inventory-manager/customers",
    icon: Customer,
  },
];

export const inventoryInChargeMenus = [
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
];
