import ImagePagination from "@/components/image-pagination";
import Wrapper from "@/components/wrapper";
import { getRequest } from "@/lib/api/requestUtils";
import Image from "next/image";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const ImagesPage = async ({
  params,
}: {
  params: Promise<{ currentPage: string }>;
}) => {
  const { currentPage } = await params;
  const page = parseInt(currentPage);

  const pageCountResponse = await getRequest("/api/image/count");
  const { pageCount } = pageCountResponse.data as { pageCount: string };
  const response = await getRequest("/api/image/folders?page=" + page);
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
      <ImagePagination currentPage={page} totalPages={parseInt(pageCount)} />
    </Wrapper>
  );
};

export default ImagesPage;
