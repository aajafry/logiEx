import { LoadingButton } from "@/atoms";
import { shipmentColumns } from "@/config";
import { useShipments, useVisibility } from "@/hooks";
import { DeleteShipmentConfirmation } from "@/molecules";
import {
  CreateShipmentForm,
  ShipmentDataTable,
  UpdateShipmentFrom,
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
import { useNavigate } from "react-router-dom";

export const Shipments = () => {
  const [shipmentIdToEdit, setShipmentIdToEdit] = useState(null);
  const [shipmentIdToDelete, setShipmentIdToDelete] = useState(null);

  const navigate = useNavigate();

  const [filterredShipments, setFilterredShipments] = useState([]);
  const { visibility, openVisibility, closeVisibility } = useVisibility();

  const {
    shipments,
    getShipments,
    handleAddShipment,
    handleUpdateShipment,
    handleRemoveShipment,
  } = useShipments();

  const loadShipments = useCallback(async () => {
    await getShipments();
  }, [getShipments]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handlePreviewShipment = useCallback(
    (previewShipment) => {
      navigate(`${previewShipment?.toLowerCase()}`, {
        state: previewShipment?.toLowerCase(),
      });
    },
    [navigate]
  );

  const handleEditShipment = useCallback(
    (updatedShipmentId) => {
      setShipmentIdToEdit(updatedShipmentId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteShipment = useCallback(
    (deletedShipmentId) => {
      setShipmentIdToDelete(deletedShipmentId);
      openVisibility("DELETE");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () =>
      shipmentColumns(
        handlePreviewShipment,
        handleEditShipment,
        handleDeleteShipment
      ),
    [handleDeleteShipment, handleEditShipment, handlePreviewShipment]
  );

  const { role, email } = getUser();

  useEffect(() => {
    if (role === "captain") {
      const filterredShipment = shipments.filter(
        (shipment) => shipment.captain.email === email
      );
      setFilterredShipments(filterredShipment);
    } else {
      setFilterredShipments(shipments);
    }
  }, [email, role, shipments]);

  return (
    <>
      {/* add shipment */}
      <Dialog open={visibility.ADD} onOpenChange={() => closeVisibility("ADD")}>
        <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Shipment</DialogTitle>
            <DialogDescription>
              Enter the required information to add a new Shipment to the
              system.
            </DialogDescription>
          </DialogHeader>
          <CreateShipmentForm
            onAddShipment={handleAddShipment}
            onClose={() => closeVisibility("ADD")}
          />
        </DialogContent>
      </Dialog>

      {/* edit shipment */}
      {[
        "admin",
        "fleet-manager",
        "inventory-manager",
        "inventory-in-charge",
        "captain",
      ].includes(role) && (
        <Dialog
          open={visibility.EDIT}
          onOpenChange={() => closeVisibility("EDIT")}
        >
          <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Shipment</DialogTitle>
              <DialogDescription>
                Update the Shipment details. Ensure accuracy before saving.
              </DialogDescription>
            </DialogHeader>
            <UpdateShipmentFrom
              shipmentId={shipmentIdToEdit}
              onUpdateShipment={handleUpdateShipment}
              onClose={() => closeVisibility("EDIT")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* delete shipment */}
      {["admin", "fleet-manager"].includes(role) && (
        <Dialog
          open={visibility.DELETE}
          onOpenChange={() => closeVisibility("DELETE")}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Shipment</DialogTitle>
            </DialogHeader>
            <DeleteShipmentConfirmation
              shipmentId={shipmentIdToDelete}
              onRemoveShipment={handleRemoveShipment}
              onClose={() => closeVisibility("DELETE")}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* view shipments */}
      <div className="p-4 mb-4 space-y-4">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Shipments</p>
          {["admin", "fleet-manager"].includes(role) && (
            <LoadingButton
              label="Create Shipment"
              size="sm"
              onClick={() => openVisibility("ADD")}
            />
          )}
        </div>
        <ShipmentDataTable columns={columns} data={filterredShipments} />
      </div>
    </>
  );
};
