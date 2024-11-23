import { LoadingButton } from "@/atoms";
import { salesColumns } from "@/config";
import { useSales, useSupervisors, useVisibility } from "@/hooks";
import { DeleteSaleConfirmation } from "@/molecules";
import { CreateSaleForm, SaleDataTable, UpdateSaleFrom } from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Sales = () => {
  const [billIdToEdit, setBillIdToEdit] = useState(null);
  const [billIdToDelete, setBillIdToDelete] = useState(null);
  const [filterredSales, setFilterredSales] = useState([]);
  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const { sales, getSales, handleAddSale, handleUpdateSale, handleRemoveSale } =
    useSales();
  const { supervisors, getSupervisors } = useSupervisors();

  const loadSales = useCallback(async () => {
    await getSales();
  }, [getSales]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleEditSale = useCallback(
    (updatedSaleBillId) => {
      setBillIdToEdit(updatedSaleBillId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteSale = useCallback(
    (deletedSaleBillId) => {
      setBillIdToDelete(deletedSaleBillId);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => salesColumns(handleEditSale, handleDeleteSale),
    [handleDeleteSale, handleEditSale]
  );

  const { role, email } = getUser();

  const loadSupervisor = useCallback(async () => {
    if (role === "inventory-in-charge") {
      await getSupervisors();
    }
  }, [getSupervisors, role]);

  useEffect(() => {
    loadSupervisor();
  }, [loadSupervisor]);

  useEffect(() => {
    if (role === "inventory-in-charge") {
      supervisors.forEach((supervisor) => {
        if (
          supervisor?.employee?.email === email &&
          supervisor?.employee_status === true
        ) {
          const filterredSale = sales.filter(
            (sale) => sale?.inventory === supervisor?.inventory
          );
          setFilterredSales(filterredSale);
        }
      });
    } else {
      setFilterredSales(sales);
    }
  }, [role, supervisors, email, sales]);

  return (
    <>
      {/* add sale */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Sale</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Sale to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateSaleForm
            onAddSale={handleAddSale}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit sale */}
      {["admin", "inventory-manager", "inventory-in-charge"].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Sale</DialogTitle>
              <DialogDescription>
                Update the Sale details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateSaleFrom
              saleBillId={billIdToEdit}
              onUpdateSale={handleUpdateSale}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete sale */}
      {["admin", "inventory-manager"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Sale</DialogTitle>
            </DialogHeader>
            <DeleteSaleConfirmation
              saleBillId={billIdToDelete}
              onRemoveSale={handleRemoveSale}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}
      {/* view sales */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Sales</p>
          {["admin", "inventory-manager", "inventory-in-charge"].includes(
            role
          ) && (
            <LoadingButton
              label="Create Sale"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <SaleDataTable columns={columns} data={filterredSales} />
      </div>
    </>
  );
};
