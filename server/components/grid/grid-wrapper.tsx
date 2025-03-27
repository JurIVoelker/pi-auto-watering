"use client";

import { Image, Plant, WeighthMeasurement } from "@prisma/client";
import GraphCard from "./graph-card";
import GridCard from "./grid-card";
import PlantCard from "./plant-card";

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
        onClick={() => {}}
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
        content="5"
        description="Letzte Gießung vor"
        className="sm:col-span-2 sm:row-start-6 md:row-start-auto col-span-1 md:col-span-3 lg:col-span-2"
      />
    </div>
  );
};

export default GridWrapper;
