import { LoadingButton } from "@/atoms";
import { vehicleColumns } from "@/config";
import { useVehicles, useVisibility } from "@/hooks";
import { DeleteVehicleConfirmation } from "@/molecules";
import {
  CreateVehicleForm,
  UpdateVehicleFrom,
  VehicleDataTable,
} from "@/organisms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { getUser } from "@/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

export const Vehicles = () => {
  const [vehicleVINToEdit, setVehicleVINToEdit] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState({
    vin: null,
    brand: null,
  });

  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    vehicles,
    getVehicles,
    handleAddVehicle,
    handleUpdateVehicle,
    handleRemoveVehicle,
  } = useVehicles();

  const loadVehicles = useCallback(async () => {
    await getVehicles();
  }, [getVehicles]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleEditVehicle = useCallback(
    (updatedvehicleVIN) => {
      setVehicleVINToEdit(updatedvehicleVIN);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteVehicle = useCallback(
    (vin, brand) => {
      setVehicleToDelete({ vin, brand });
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => vehicleColumns(handleEditVehicle, handleDeleteVehicle),
    [handleDeleteVehicle, handleEditVehicle]
  );

  const { role } = getUser();

  return (
    <>
      {/* add vehicle */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Vehicle</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Vehicle to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateVehicleForm
            onAddVehicle={handleAddVehicle}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit vehicle */}
      {["admin", "fleet-manager"].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="sm:max-w-md h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vehicle</DialogTitle>
              <DialogDescription>
                Update the vehicle&apos;s details. Ensure accuracy before
                saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateVehicleFrom
              vehicleVIN={vehicleVINToEdit}
              onUpdateVehicle={handleUpdateVehicle}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete vehicle */}
      {["admin", "fleet-manager"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete vehicle</DialogTitle>
            </DialogHeader>
            <DeleteVehicleConfirmation
              vehicleToDelete={vehicleToDelete}
              onRemoveVehicle={handleRemoveVehicle}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view vehicles */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Vehicles</p>
          {["admin", "fleet-manager"].includes(role) && (
            <LoadingButton
              label="Create Vehicle"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <VehicleDataTable columns={columns} data={vehicles} />
      </div>
    </>
  );
};
