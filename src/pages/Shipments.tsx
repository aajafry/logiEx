import { LoadingButton } from "@/atoms";
import { shipmentColumns } from "@/config";
import { useShipments, useVisibility } from "@/hooks";
import { IShipment } from "@/interfaces";
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
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Shipments: FC = () => {
  const [shipmentIdToEdit, setShipmentIdToEdit] = useState<string>("");
  const [shipmentIdToDelete, setShipmentIdToDelete] = useState<string>("");

  const navigate = useNavigate();

  const [filterredShipments, setFilterredShipments] = useState<IShipment[]>([]);
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
    (previewShipment: string) => {
      navigate(`${previewShipment?.toLowerCase()}`, {
        state: previewShipment?.toLowerCase(),
      });
    },
    [navigate]
  );

  const handleEditShipment = useCallback(
    (updatedShipmentId: string) => {
      setShipmentIdToEdit(updatedShipmentId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const handleDeleteShipment = useCallback(
    (deletedShipmentId: string) => {
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

  const user = getUser();
  const role = user?.role;
  const email = user?.email;

  const canEdit =
    role &&
    [
      "admin",
      "fleet-manager",
      "inventory-manager",
      "inventory-in-charge",
      "captain",
    ].includes(role);
  const canDelete = role && ["admin", "fleet-manager"].includes(role);
  const canCreate = role && ["admin", "fleet-manager"].includes(role);

  useEffect(() => {
    if (role === "captain") {
      const filterredShipment = shipments.filter(
        (shipment) => shipment?.captain?.email === email
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
      {canEdit && (
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
      {canDelete && (
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
          {canCreate && (
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
