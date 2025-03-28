"use client";

import { Image, Plant, Watering, WeighthMeasurement } from "@prisma/client";
import GraphCard from "./graph-card";
import GridCard from "./grid-card";
import PlantCard from "./plant-card";
import { useState } from "react";
import WateringVolumeDialog from "../dialog/water-dialog";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface GridWrapperProps {
  chartData: WeighthMeasurement[];
  latestImage: Image | null;
  plant: Plant | null;
  lastWatering: Watering | null;
}

const GridWrapper: React.FC<GridWrapperProps> = ({
  chartData,
  latestImage,
  plant,
  lastWatering,
}) => {
  const [volumeDialog, setVolumeDialog] = useState(false);
  const [wateringDialog, setWateringDialog] = useState(false);

  const onSaveVolume = async (volume: number) => {
    console.log(volume);
    setVolumeDialog(false);
  };

  const onSaveWatering = async (volume: number) => {
    console.log(volume);
    setVolumeDialog(false);
  };

  const timeSinceLastWatering = lastWatering
    ? formatDistanceToNow(new Date(lastWatering.wateredAt), {
        addSuffix: true,
        locale: de,
      })
    : "Keine Daten verfügbar";

  const nextWatering = plant?.nextWateringAt
    ? formatDistanceToNow(new Date(plant.nextWateringAt), {
        addSuffix: true,
        locale: de,
      })
    : "Keine Daten verfügbar";

  const refill = plant?.refillAt
    ? formatDistanceToNow(new Date(plant.refillAt), {
        addSuffix: true,
        locale: de,
      })
    : "Keine Daten verfügbar";

  return (
    <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-6">
      <GridCard
        content={timeSinceLastWatering}
        description="Letzte Gießung vor"
      />
      <GridCard content={nextWatering} description="Nächste Gießung in" />
      <GridCard
        content={`${plant?.wateringAmount} ml`}
        description="Gießvolumen"
        onClick={() => setWateringDialog(true)}
        buttonLabel="Anpassen"
      />
      <PlantCard latestImage={latestImage} plant={plant} />
      <GraphCard chartData={chartData} />
      <GridCard
        content={`${plant?.waterTankVolume} ml`}
        description="Volumen Wassertank"
        onClick={() => setVolumeDialog(true)}
        buttonLabel="Ändern"
      />
      <GridCard
        content={refill}
        description="Nachfüllen spätestens in"
        onClick={() => {}}
        buttonLabel="Jetzt Auffüllen"
      />
      <GridCard
        content="TODO"
        description="TODO"
        className="sm:col-span-2 sm:row-start-6 md:row-start-auto col-span-1 md:col-span-3 lg:col-span-2"
      />
      <WateringVolumeDialog
        defaultValue={plant?.waterTankVolume}
        open={volumeDialog}
        setOpen={setVolumeDialog}
        onSave={onSaveVolume}
        desciption="Bitte geben Sie das neue Volumen des Wassertanks ein."
        title="Wassertank Volumen"
      />
      <WateringVolumeDialog
        defaultValue={plant?.wateringAmount}
        open={wateringDialog}
        setOpen={setWateringDialog}
        onSave={onSaveWatering}
      />
    </div>
  );
};

export default GridWrapper;
