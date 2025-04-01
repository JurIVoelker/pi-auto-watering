import Wrapper from "@/components/wrapper";
import GridWrapper from "@/components/grid/grid-wrapper";
import { prisma } from "@/prisma/prisma";
import { PLANT_ID } from "@/constants/constants";
import { getChartData } from "@/lib/utils";

export const revalidate = 300;

const Dashboard = async () => {
  const allWeights = await prisma.weightMeasurement.findMany({});
  const allWaterings = await prisma.watering.findMany({
    where: {
      plantId: PLANT_ID,
    },
    orderBy: {
      wateredAt: "desc",
    },
  });

  const chartDataToday = getChartData(allWeights, "today", allWaterings);
  const chartDataLastWatering = getChartData(
    allWeights,
    "last-watering",
    allWaterings
  );
  const chartDataWeek = getChartData(allWeights, "1-week", allWaterings);
  const chartDataMonth = getChartData(allWeights, "1-month", allWaterings);
  const chartDataYear = getChartData(allWeights, "1-year", allWaterings);
  const chartDataMax = getChartData(allWeights, "max", allWaterings);

  const latestImage = await prisma.image.findFirst({
    orderBy: {
      capturedAt: "desc",
    },
  });

  const plant = await prisma.plant.findFirst({
    where: {
      id: PLANT_ID,
    },
  });

  return (
    <Wrapper>
      <h3>Dashboard</h3>
      <GridWrapper
        chartDataToday={chartDataToday}
        chartDataLastWatering={chartDataLastWatering}
        chartDataWeek={chartDataWeek}
        chartDataMonth={chartDataMonth}
        chartDataYear={chartDataYear}
        chartDataMax={chartDataMax}
        latestImage={latestImage}
        plant={plant}
        lastWaterings={allWaterings}
      />
    </Wrapper>
  );
};

export default Dashboard;
