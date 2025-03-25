import { prisma } from "@/prisma/prisma";
import Image from "next/image";

export default async function Home() {
  const images = await prisma.image.findMany();
  return (
    <div>
      <h1>Home</h1>
      <h4>test</h4>
      <p>Welcome to your new app!</p>
      {images.map((image) => (
        <Image
          key={image.id}
          src={image.url}
          alt={""}
          width={image.width}
          height={image.height}
        />
      ))}
    </div>
  );
}
