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
import { buttonVariants } from "../ui/button";
import ConnectionStatus from "../connection-status";
import { ImageType } from "@/types/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
          sizes="(max-width: 640px) 557px, (max-width: 768px) 333px, (max-width: 1024px) 307px, 286px"
        />
      )}
      <CardHeader>
        <CardTitle>{plant?.name}</CardTitle>
        <CardDescription>{plant?.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ConnectionStatus lastPing={plant?.lastPingAt} />
        <Link
          href="/images/0"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full no-underline"
          )}
        >
          Mehr Fotos
        </Link>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
