"use client";

import type React from "react";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MinusIcon, PlusIcon } from "lucide-react";

interface WateringVolumeDialogProps {
  defaultValue?: number;
  onSave: (volume: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  desciption?: string;
  steps?: number[]; // Array of step values for buttons
}

export default function WateringVolumeDialog({
  defaultValue = 500,
  open,
  setOpen,
  onSave,
  title = "Menge anpassen",
  desciption = "Passe die Bewässerungsmenge für deine Pflanzen an.",
  steps = [20, 100], // Default steps
}: WateringVolumeDialogProps) {
  const [volume, setVolume] = useState(defaultValue); // Bewässerungsmenge in ml

  const adjustVolume = (amount: number) => {
    const newVolume = Math.max(0, volume + amount);
    setVolume(newVolume);
  };

  const handleSave = () => {
    onSave(volume);
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setVolume(defaultValue); // Reset to default value when closing
    }
    setOpen(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="leading-5">
              {desciption}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 mt-4">
            <div className="flex items-center justify-center text-center">
              <div className="text-3xl font-bold">{volume} ml</div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 pb-2">
                {steps.map((step) => (
                  <Fragment key={step}>
                    <Button
                      variant="outline"
                      onClick={() => adjustVolume(-step)}
                      className="flex items-center justify-center"
                    >
                      <MinusIcon className="h-4 w-4 mr-1" />
                      {step}ml
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => adjustVolume(step)}
                      className="flex items-center justify-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      {step}ml
                    </Button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
