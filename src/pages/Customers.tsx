import { LoadingButton } from "@/atoms";
import { customerColumns } from "@/config";
import { useCustomers, useVisibility } from "@/hooks";
import { DeleteCustomerConfirmation } from "@/molecules";
import {
  CommonDataTable,
  CreateCustomerForm,
  UpdateCustomerFrom,
} from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

export const Customers: FC = () => {
  const [customerIdToEdit, setCustomerIdToEdit] = useState<string>("");
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    customers,
    getCustomers,
    handleAddCustomer,
    handleUpdateCustomer,
    handleRemoveCustomer,
  } = useCustomers();

  const loadCustomers = useCallback(async () => {
    await getCustomers();
  }, [getCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleEditCustomer = useCallback(
    (updatedCustomerId: string) => {
      setCustomerIdToEdit(updatedCustomerId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteCustomer = useCallback(
    (id: string, name: string) => {
      setCustomerToDelete({ id, name });
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => customerColumns(handleEditCustomer, handleDeleteCustomer),
    [handleDeleteCustomer, handleEditCustomer]
  );

  const user = getUser();
  const role = user?.role;
  const canEdit =
    role &&
    ["admin", "inventory-manager", "inventory-in-charge"].includes(role);
  const canDelete = role === "admin";
  const canCreate = canEdit;

  return (
    <>
      {/* add customer */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Customer</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Customer to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateCustomerForm
            onAddCustomer={handleAddCustomer}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit customer */}
      {canEdit && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>
                Update the customer&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateCustomerFrom
              customerId={customerIdToEdit}
              onUpdateCustomer={handleUpdateCustomer}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete customer */}
      {canDelete && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
            </DialogHeader>
            <DeleteCustomerConfirmation
              customerToDelete={customerToDelete}
              onRemoveCustomer={handleRemoveCustomer}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view customer */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Customers</p>
          {canCreate && (
            <LoadingButton
              label="Create Customer"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <CommonDataTable
          columns={columns}
          data={customers}
          searchColumn="email"
        />
      </div>
    </>
  );
};
