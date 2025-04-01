"use client";
import { useState } from "react";
import ManualWateringDialog from "../dialog/manual-watering-dialog";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ActionCardProps {
  wateringAmount: number;
}

const ActionCard: React.FC<ActionCardProps> = ({ wateringAmount }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card className="sm:col-span-2 sm:row-start-6 md:row-start-auto col-span-1 md:col-span-3 lg:col-span-2 row-start-8">
      <CardHeader>
        <CardTitle>Manuell gießen</CardTitle>
        <CardDescription>Pumpe manuell betätigen um zu gießen</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setOpen(true)}>Gießen</Button>
      </CardContent>
      <ManualWateringDialog
        open={open}
        setOpen={setOpen}
        wateringAmount={wateringAmount}
      />
    </Card>
  );
};

export default ActionCard;
