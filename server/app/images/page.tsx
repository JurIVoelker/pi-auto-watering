import Wrapper from "@/components/wrapper";
import { getRequest } from "@/lib/api/requestUtils";
import Image from "next/image";

const ImagesPage = async () => {
  const response = await getRequest("/api/image/folders");
  const folders = response as {
    data: { name: string; width: number; height: number }[];
  };

  return (
    <Wrapper>
      <div className="grid sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 grid-cols-1">
        {folders?.data?.reverse().map((image, index) => (
          <div
            key={index}
            className="bg-white pb-4 rounded-lg shadow text-center"
          >
            <Image
              className="rounded-t-lg mb-4"
              width={image.width}
              height={image.height}
              src={"/api/public/" + image.name}
              alt="Plant"
              sizes="(max-width: 640px) 557px, (max-width: 768px) 333px, (max-width: 1024px) 307px, 286px"
            />
            {image.name
              .split("/")[1]
              .split("_")[0]
              .split("-")
              .reverse()
              .join(".")}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default ImagesPage;
