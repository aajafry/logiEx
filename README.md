# logiEx frontend interfaces Overview

**logiEx** frontend is built with React, tailwind CSS, shadcn and follows the Atomic Design methodology. which provides an interactive user interface for managing logistics operations, such as inventory control, vendor tracking, shipment management, and more. This section of the project interacts with the backend APIs to deliver a seamless experience to the users.

## Installation Instructions

1. **Clone the Repository**:

- Clone the repository and switch to the frontend branch:

```bash
git clone https://github.com/aajafry/logiEx.git
```

2. **Install Dependencies:**

- Navigate to the project directory and install the necessary packages:

```bash
npm install
```

3. **Set Up Environment Variables:**

- Create a `.env` file in the root directory and add the following:

```env
VITE_AUTH=http://localhost:3000/auth
VITE_USERS=http://localhost:3000/users
VITE_CUSTOMERS=http://localhost:3000/customers
VITE_VEHICLES=http://localhost:3000/vehicles
VITE_VENDORS=http://localhost:3000/vendors
VITE_INVENTORIES=http://localhost:3000/inventories
VITE_CATEGORIES=http://localhost:3000/categories
VITE_PRODUCTS=http://localhost:3000/products
VITE_INVENTORY_EMPLOYMENTS=http://localhost:3000/inventory-employments
VITE_PURCHASES=http://localhost:3000/purchases
VITE_PURCHASE_PRODUCTS=http://localhost:3000/purchase-products
VITE_SALES=http://localhost:3000/sales
VITE_SALE_PRODUCTS=http://localhost:3000/sale-products
VITE_TRANSFERS=http://localhost:3000/transfers
VITE_TRANSFER_PRODUCTS=http://localhost:3000/transfer-products
VITE_SHIPMENTS=http://localhost:3000/shipments
VITE_SHIPMENT_PRODUCTS=http://localhost:3000/shipment-products
VITE_INVENTORY_PRODUCTS=http://localhost:3000/inventory-products
```

Replace `http://localhost:3000` with the URL where the backend is running.

4. **Start the Server:**

```bash
npm run dev
```

## API Integration

The frontend interacts with the backend via REST APIs. Ensure the backend is running before testing the frontend to avoid API errors.

The logiEx API can be found at [logiEx API Repo](https://github.com/aajafry/logiEx_api).
