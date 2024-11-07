import { ThemeProvider } from "@/contexts";
import {
  Authentication,
  Categories,
  Dashboard,
  Employees,
  Inventories,
  Products,
  Purchases,
  Reports,
  Sales,
  Shipments,
  Transfers,
  Vehicles,
  Vendors,
  Customers,
  NotFound,
  Profile,
  ResetPassword,
} from "@/pages";
import { withLayout } from "@/templates";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="logiEx-ui-theme">
      <Router>
        <Routes>
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* admin routes */}
          <Route path="/" element={withLayout(Dashboard, "admin")} />
          <Route path="/admin" element={withLayout(Dashboard, "admin")} />
          <Route
            path="/admin/dashboard"
            element={withLayout(Dashboard, "admin")}
          />
          <Route path="/admin/vendors" element={withLayout(Vendors, "admin")} />
          <Route
            path="/admin/categories"
            element={withLayout(Categories, "admin")}
          />
          <Route
            path="/admin/products"
            element={withLayout(Products, "admin")}
          />
          <Route
            path="/admin/purchases"
            element={withLayout(Purchases, "admin")}
          />
          <Route
            path="/admin/inventories"
            element={withLayout(Inventories, "admin")}
          />
          <Route
            path="/admin/transfers"
            element={withLayout(Transfers, "admin")}
          />
          <Route path="/admin/sales" element={withLayout(Sales, "admin")} />
          <Route
            path="/admin/shipments"
            element={withLayout(Shipments, "admin")}
          />
          <Route
            path="/admin/vehicles"
            element={withLayout(Vehicles, "admin")}
          />
          <Route
            path="/admin/employees"
            element={withLayout(Employees, "admin")}
          />
          <Route
            path="/admin/customers"
            element={withLayout(Customers, "admin")}
          />
          <Route path="/admin/reports" element={withLayout(Reports, "admin")} />
          <Route path="/admin/profile" element={withLayout(Profile, "admin")} />
          {/* procurement manager routes */}
          <Route
            path="/procurement-manager"
            element={withLayout(Vendors, "procurement-manager")}
          />
          <Route
            path="/procurement-manager/vendors"
            element={withLayout(Vendors, "procurement-manager")}
          />
          <Route
            path="/procurement-manager/categories"
            element={withLayout(Categories, "procurement-manager")}
          />
          <Route
            path="/procurement-manager/products"
            element={withLayout(Products, "procurement-manager")}
          />
          <Route
            path="/procurement-manager/purchases"
            element={withLayout(Purchases, "procurement-manager")}
          />
          <Route
            path="/procurement-manager/profile"
            element={withLayout(Profile, "procurement-manager")}
          />
          {/* fleet manager route */}
          <Route
            path="/fleet-manager"
            element={withLayout(Vehicles, "fleet-manager")}
          />
          <Route
            path="/fleet-manager/vehicles"
            element={withLayout(Vehicles, "fleet-manager")}
          />
          <Route
            path="/fleet-manager/captains"
            element={withLayout(Employees, "fleet-manager")}
          />
          <Route
            path="/fleet-manager/shipments"
            element={withLayout(Shipments, "fleet-manager")}
          />
          <Route
            path="/fleet-manager/profile"
            element={withLayout(Profile, "fleet-manager")}
          />
          {/* inventories manager route */}
          <Route
            path="/inventory-manager"
            element={withLayout(Inventories, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/inventories"
            element={withLayout(Inventories, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/transfers"
            element={withLayout(Transfers, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/sales"
            element={withLayout(Sales, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/shipments"
            element={withLayout(Shipments, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/supervisors"
            element={withLayout(Employees, "inventory-manager")}
          />
          <Route
            path="/inventory-manager/customers"
            element={withLayout(Customers, "admin")}
          />
          <Route
            path="/inventory-manager/profile"
            element={withLayout(Profile, "inventory-manager")}
          />
          {/* inventory in-charge route */}
          <Route
            path="/inventory-in-charge"
            element={withLayout(Inventories, "inventory-in-charge")}
          />
          <Route
            path="/inventory-in-charge/inventory"
            element={withLayout(Inventories, "inventory-in-charge")}
          />
          <Route
            path="/inventory-in-charge/transfers"
            element={withLayout(Transfers, "inventory-in-charge")}
          />
          <Route
            path="/inventory-in-charge/sales"
            element={withLayout(Sales, "inventory-in-charge")}
          />
          <Route
            path="/inventory-in-charge/shipments"
            element={withLayout(Shipments, "inventory-in-charge")}
          />
          <Route
            path="/inventory-in-charge/customers"
            element={withLayout(Customers, "admin")}
          />
          <Route
            path="/inventory-in-charge/profile"
            element={withLayout(Profile, "inventory-in-charge")}
          />
          {/* captain route */}
          <Route path="/captain" element={withLayout(Shipments, "captain")} />
          <Route
            path="/captain/shipments"
            element={withLayout(Shipments, "captain")}
          />
          <Route
            path="/captain/profile"
            element={withLayout(Profile, "captain")}
          />
          {/* common route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
