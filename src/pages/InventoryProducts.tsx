import { inventoryProductColumns } from "@/config";
import { useInventories } from "@/hooks";
import { IInventory } from "@/interfaces";
import { CommonDataTable } from "@/organisms";
import { Button } from "@/shadcn/components/ui/button";
import { getUser } from "@/utilities";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const InventoryProducts: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getInventory } = useInventories();
  const [inventory, setInventory] = useState<IInventory | null>(null);

  const loadInventory = useCallback(async () => {
    setInventory((await getInventory(location.state)) ?? null);
  }, [getInventory, location.state]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const columns = useMemo(() => inventoryProductColumns(), []);

  const user = getUser();
  const role = user?.role;

  return (
    <>
      <div className="p-4 mb-4 space-y-6">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">
            Inventory Details
          </p>
          {role !== "inventory-in-charge" && (
            <Button size="sm" onClick={() => navigate(-1)}>
              Back{" "}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 font-light">
          <p>
            <span className="font-medium mr-2">Name:</span>
            {inventory?.name ?? "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Address:</span>
            {inventory?.address ?? "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Email:</span>
            {inventory?.email ?? "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Description:</span>
            {inventory?.description ?? "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Phone:</span>
            {inventory?.phone ?? "N/A"}
          </p>
        </div>

        <>
          <CommonDataTable
            columns={columns}
            data={inventory?.inventories || []}
            searchColumn="product"
          />
        </>
      </div>
    </>
  );
};
