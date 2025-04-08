"use client";
import { Plant } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import ConnectionStatus from "../connection-status";
import { ImageType } from "@/types/types";

interface PlantCardProps {
  latestImage: ImageType | null;
  plant: Plant | null;
}

const PlantCard: React.FC<PlantCardProps> = ({ latestImage, plant }) => {
  return (
    <Card
      className="md:col-start-3 md:row-start-1 md:row-span-3 
                 lg:row-start-1 lg:col-start-4 lg:row-span-3
                 sm:row-span-2 sm:row-start-4
                 pt-0 row-start-1"
    >
      {latestImage && (
        <Image
          className="rounded-t-lg"
          width={latestImage.width}
          height={latestImage.height}
          src={"/api/public/" + latestImage.name}
          alt="Plant"
        />
      )}
      <CardHeader>
        <CardTitle>{plant?.name}</CardTitle>
        <CardDescription>{plant?.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ConnectionStatus lastPing={plant?.lastPingAt} />
        <Button className="w-full">Mehr Fotos</Button>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
