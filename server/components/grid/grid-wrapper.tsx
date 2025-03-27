"use client";

import { Image, Plant, WeighthMeasurement } from "@prisma/client";
import GraphCard from "./graph-card";
import GridCard from "./grid-card";
import PlantCard from "./plant-card";
import { useState } from "react";
import WateringVolumeDialog from "../dialog/water-dialog";

interface GridWrapperProps {
  chartData: WeighthMeasurement[];
  latestImage: Image | null;
  plant: Plant | null;
}

const GridWrapper: React.FC<GridWrapperProps> = ({
  chartData,
  latestImage,
  plant,
}) => {
  const [volumeDialog, setVolumeDialog] = useState(false);
  const onSaveVolume = async (volume: number) => {
    console.log(volume);
    setVolumeDialog(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-6">
      <GridCard content="1 Stunde" description="Letzte Gießung vor" />
      <GridCard
        content="1 Tag und 15 Stunden"
        description="Nächste Gießung in"
      />
      <GridCard
        content="200ml"
        description="Gießvolumen"
        onClick={() => setVolumeDialog(true)}
        buttonLabel="Anpassen"
      />
      <PlantCard latestImage={latestImage} plant={plant} />
      <GraphCard chartData={chartData} />
      <GridCard
        content="4.5L"
        description="Volumen Wassertank"
        onClick={() => {}}
        buttonLabel="Ändern"
      />
      <GridCard
        content="4.5L"
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
        defaultValue={500}
        open={volumeDialog}
        setOpen={setVolumeDialog}
        onSave={onSaveVolume}
      />
    </div>
  );
};

export default GridWrapper;
