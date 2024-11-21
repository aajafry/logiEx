import { shipmentItemsColumns } from "@/config/shipmentItemsColumns";
import { useSales, useShipments, useVisibility } from "@/hooks";
import { DataTable } from "@/molecules";
import { UpdateSaleFrom } from "@/organisms";
import { Button } from "@/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ShipmentItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getShipment } = useShipments();
  const [shipment, setShipment] = useState();
  const [billIdToEdit, setBillIdToEdit] = useState(null);

  const { visibility, openVisibility, closeVisibility } = useVisibility();
  const { handleUpdateSale } = useSales();

  const loadShipment = useCallback(async () => {
    setShipment(await getShipment(location.state));
  }, [getShipment, location.state]);

  useEffect(() => {
    loadShipment();
  }, [loadShipment]);

  const handleEditSaleStatus = useCallback(
    (updatedSaleId) => {
      setBillIdToEdit(updatedSaleId);
      openVisibility("EDIT");
    },
    [openVisibility]
  );

  const columns = useMemo(
    () => shipmentItemsColumns(handleEditSaleStatus),
    [handleEditSaleStatus]
  );

  return (
    <>
      <Dialog
        open={visibility.EDIT}
        onOpenChange={() => closeVisibility("EDIT")}
      >
        <DialogContent className="max-w-[100vw] sm:max-w-[90vw] h-[100vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Sales Status</DialogTitle>
            <DialogDescription>
              Update the Sales Status. Ensure accuracy before saving.
            </DialogDescription>
          </DialogHeader>
          <UpdateSaleFrom
            saleBillId={billIdToEdit}
            onUpdateSale={handleUpdateSale}
            onClose={() => closeVisibility("EDIT")}
          />
        </DialogContent>
      </Dialog>

      <div className="p-4 mb-4 space-y-6">
        <div className="flex justify-between">
          <p className="text-lg font-medium tracking-tight">Shipment Details</p>
          <Button size="sm" onClick={() => navigate(-1)}>
            Back{" "}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 font-light">
          <p>
            <span className="font-medium mr-2">Shipment ID:</span>
            {shipment?.shipment_id || "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Shipment Date:</span>
            {moment(shipment?.shipment_date).format("YYYY-MMM-DD") || "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Captain Name:</span>
            {shipment?.captain?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Vehicle:</span>
            {shipment?.vehicle
              ? `${shipment?.vehicle?.make} ${shipment?.vehicle?.model} ${shipment?.vehicle?.year}`
              : "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Captain Email:</span>
            {shipment?.captain?.email || "N/A"}
          </p>
          <p>
            <span className="font-medium mr-2">Vehicle VIN:</span>
            {shipment?.vehicle?.vin || "N/A"}
          </p>

          <p>
            <span className="font-medium mr-2">Status:</span>
            {shipment?.status || "N/A"}
          </p>
        </div>

        <DataTable
          columns={columns}
          data={shipment?.items || []}
          filterColumn="bill_id"
        />
      </div>
    </>
  );
};
