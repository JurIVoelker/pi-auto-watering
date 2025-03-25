import Wrapper from "@/components/wrapper";
import GridWrapper from "@/components/grid/grid-wrapper";
import { prisma } from "@/prisma/prisma";

const Dashboard = async () => {
  const weights = await prisma.weighthMeasurement.findMany({
    orderBy: {
      measuredAt: "asc",
    },
  });

  return (
    <Wrapper>
      <h3>Dashboard</h3>
      <GridWrapper chartData={weights} />
    </Wrapper>
  );
};

export default Dashboard;
