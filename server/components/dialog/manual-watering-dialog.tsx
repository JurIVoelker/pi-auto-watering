"use client";
import {} from "@radix-ui/react-dialog";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { postRequest } from "@/lib/api/requestUtils";

interface ManualWateringDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  wateringAmount: number;
}

const ManualWateringDialog: React.FC<ManualWateringDialogProps> = ({
  open,
  setOpen,
  wateringAmount,
}) => {
  const handleSave = async () => {
    const res = await postRequest("/api/watering", {
      wateredAt: new Date().toISOString(),
      amount: wateringAmount,
      executed: false,
    });
    if (res?.error) {
      console.error(res.error);
      return;
    }
    console.log(res);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manuell gießen</DialogTitle>
          <DialogDescription className="leading-5">
            Möchtest du die Pumpe manuell betätigen, um zu gießen?
          </DialogDescription>
        </DialogHeader>
        <div className="w-full bg-slate-50 p-4 rounded-xl text-center text-slate-900">
          Bewässerungsmege: {wateringAmount} ml
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full mt-4">
            Jetzt Gießen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualWateringDialog;
