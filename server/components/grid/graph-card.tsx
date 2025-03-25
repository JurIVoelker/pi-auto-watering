import { Card, CardContent } from "../ui/card";

const GraphCard = () => {
  return (
    <Card className="col-start-1 row-start-2 lg:row-span-3 lg:col-span-2 md:col-start-1 md:row-start-2 md:row-span-2 md:col-span-2 sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:col-span-2">
      <CardContent>graph card</CardContent>
    </Card>
  );
};

export default GraphCard;
