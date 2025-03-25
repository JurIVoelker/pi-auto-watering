"use client";
import { Card, CardContent } from "../ui/card";

const PlantCard = () => {
  return (
    <Card
      className="md:col-start-3 md:row-start-1 md:row-span-3 
                 lg:row-start-1 lg:col-start-4 lg:row-span-3
                 sm:row-span-2"
    >
      <CardContent>
        plant cardplant cardplant cardplant cardplant cardplant cardplant
        cardplant cardplant cardplant cardplant cardplant cardplant cardplant
        cardplant cardplant cardplant cardplant cardplant cardplant cardplant
        cardplant cardplant cardplant card cardplant cardplant cardplant card
      </CardContent>
    </Card>
  );
};

export default PlantCard;
