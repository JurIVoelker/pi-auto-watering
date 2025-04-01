"use client";

import { Image, Plant, Watering } from "@prisma/client";
import GridCard from "./grid-card";
import PlantCard from "./plant-card";
import { useState } from "react";
import WateringVolumeDialog from "../dialog/water-dialog";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import GraphCard from "./graph-card";
import { ChartData } from "@/lib/utils";
import { postRequest } from "@/lib/api/requestUtils";
import { useRouter } from "next/navigation";
import ActionCard from "./action-card";

interface GridWrapperProps {
  latestImage: Image | null;
  plant: Plant | null;
  lastWaterings: Watering[];
  chartDataToday: ChartData;
  chartDataLastWatering?: ChartData;
  chartDataWeek?: ChartData;
  chartDataMonth?: ChartData;
  chartDataYear?: ChartData;
  chartDataMax?: ChartData;
}

const GridWrapper: React.FC<GridWrapperProps> = ({
  chartDataToday,
  chartDataLastWatering,
  chartDataWeek,
  chartDataMonth,
  chartDataYear,
  chartDataMax,
  latestImage,
  plant,
  lastWaterings,
}) => {
  const [volumeDialog, setVolumeDialog] = useState(false);
  const [wateringDialog, setWateringDialog] = useState(false);

  const { refresh } = useRouter();

  const onSaveVolume = async (volume: number) => {
    const res = await postRequest("/api/config", {
      waterTankVolume: volume,
    });
    if (res?.error) {
      console.error(res.error);
      return;
    }
    setVolumeDialog(false);
    refresh();
  };

  const onSaveWatering = async (amount: number) => {
    const res = await postRequest("/api/config", {
      wateringAmount: amount,
    });
    if (res?.error) {
      console.error(res.error);
      return;
    }
    setVolumeDialog(false);
    refresh();
  };

  const lastWatering = lastWaterings[0] ?? null;

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
        className="row-start-2 sm:row-start-1"
      />
      <GridCard
        content={nextWatering}
        description="Nächste Gießung in"
        className="row-start-3 sm:row-start-1"
      />
      <GridCard
        content={`${plant?.wateringAmount} ml`}
        description="Gießvolumen"
        onClick={() => setWateringDialog(true)}
        buttonLabel="Anpassen"
        className="row-start-5 sm:row-start-4 lg:row-start-1"
      />
      <PlantCard latestImage={latestImage} plant={plant} />
      <GraphCard
        chartDataToday={chartDataToday}
        chartDataLastWatering={chartDataLastWatering}
        chartDataWeek={chartDataWeek}
        chartDataMonth={chartDataMonth}
        chartDataYear={chartDataYear}
        chartDataMax={chartDataMax}
        lastWaterings={lastWaterings}
      />
      <GridCard
        content={`${plant?.waterTankVolume} ml`}
        description="Volumen Wassertank"
        onClick={() => setVolumeDialog(true)}
        buttonLabel="Ändern"
        className="row-start-6 sm:row-start-5 md:row-start-4 lg:row-start-2"
      />
      <GridCard
        content={refill}
        description="Nachfüllen spätestens in"
        onClick={() => {}}
        buttonLabel="Jetzt Auffüllen"
        className="row-start-7 md:row-start-4 lg:row-start-3"
      />
      <ActionCard wateringAmount={plant?.wateringAmount || 0} />
      <WateringVolumeDialog
        defaultValue={plant?.waterTankVolume}
        open={volumeDialog}
        setOpen={setVolumeDialog}
        onSave={onSaveVolume}
        desciption="Bitte geben Sie das neue Volumen des Wassertanks ein."
        title="Wassertank Volumen"
        steps={[20, 50, 250]}
      />
      <WateringVolumeDialog
        defaultValue={plant?.wateringAmount}
        open={wateringDialog}
        setOpen={setWateringDialog}
        onSave={onSaveWatering}
        steps={[10, 50, 250]}
      />
    </div>
  );
};

export default GridWrapper;
