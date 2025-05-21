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
import { useRouter } from "next/navigation";

interface RefillDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refillAmount: number;
}

const RefillDialog: React.FC<RefillDialogProps> = ({
  open,
  setOpen,
  refillAmount,
}) => {
  const { refresh } = useRouter();

  const handleSave = async () => {
    const res = await postRequest("/api/config", {
      waterTankLevel: refillAmount,
    });
    if (res?.error) {
      console.error(res.error);
      return;
    }
    console.log(res);
    setOpen(false);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wassertank auffüllen</DialogTitle>
          <DialogDescription className="leading-5">
            Möchtest du Bestätigen, dass du den Wassertank aufgefüllt hast?
          </DialogDescription>
        </DialogHeader>
        <div className="w-full bg-slate-50 p-4 rounded-xl text-center text-slate-900">
          Neuer Wasserstand: {refillAmount} ml
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full mt-4">
            Auffüllen Bestätigen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefillDialog;
