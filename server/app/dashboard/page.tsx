import Wrapper from "@/components/wrapper";
import GridWrapper from "@/components/grid/grid-wrapper";
import { prisma } from "@/prisma/prisma";

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

  const plant = await prisma.plant.findFirst();

  return (
    <Wrapper>
      <h3>Dashboard</h3>
      <GridWrapper
        chartData={weights}
        latestImage={latestImage}
        plant={plant}
      />
    </Wrapper>
  );
};

export default Dashboard;
