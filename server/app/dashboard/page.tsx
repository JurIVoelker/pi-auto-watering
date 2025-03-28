import Wrapper from "@/components/wrapper";
import GridWrapper from "@/components/grid/grid-wrapper";
import { prisma } from "@/prisma/prisma";
import { PLANT_ID } from "@/constants/constants";

export const revalidate = 1;

const Dashboard = async () => {
  const weights = await prisma.weighthMeasurement.findMany({
    orderBy: {
      measuredAt: "asc",
    },
  });

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

  const lastWatering = await prisma.watering.findFirst({
    where: {
      plantId: PLANT_ID,
    },
    orderBy: {
      wateredAt: "desc",
    },
  });

  return (
    <Wrapper>
      <h3>Dashboard</h3>
      <GridWrapper
        chartData={weights}
        latestImage={latestImage}
        plant={plant}
        lastWatering={lastWatering}
      />
    </Wrapper>
  );
};

export default Dashboard;
