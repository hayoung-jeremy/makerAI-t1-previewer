import { NoImage } from "../icons";
import { SpinningLoader } from ".";
import { GeneratingStatus } from "../../hooks/useModelData";

interface Props {
  generatingStatus: GeneratingStatus;
  originalImgURL: string | null;
  removedBGImgURL: string | null;
}

const OriginalImageViewer = ({ generatingStatus, originalImgURL, removedBGImgURL }: Props) => {
  return (
    <aside className="">
      <div className="grid grid-cols-2">
        <p className="mb-2 text-[18px]">Original image</p>
        <p className="mb-2 text-[18px]">Bg removed image</p>
      </div>
      <div className="w-full grid grid-cols-2">
        {originalImgURL && originalImgURL !== "" && generatingStatus !== "Loading" ? (
          <div className="border border-white/20 overflow-hidden rounded-l-xl">
            <img src={originalImgURL} alt="original image" className="object-contain w-full h-full" />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-gray-500 border border-white/20 overflow-hidden rounded-l-xl">
            {generatingStatus === "Loading" || generatingStatus === "Waiting" ? (
              <div className="flex items-center justify-start gap-2">
                <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
                <p className="text-gray-500">{generatingStatus === "Waiting" ? "Waiting..." : "Loading..."}</p>
              </div>
            ) : (
              <NoImage />
            )}
          </div>
        )}
        {removedBGImgURL && removedBGImgURL !== "" && generatingStatus !== "Loading" ? (
          <div className="border border-white/20 overflow-hidden rounded-r-xl">
            <img src={removedBGImgURL} className="object-contain w-full h-full" />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-gray-500 border border-white/20 border-l-0 overflow-hidden rounded-r-xl">
            {generatingStatus === "Loading" || generatingStatus === "Waiting" ? (
              <div className="flex items-center justify-start gap-2">
                <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
                <p className="text-gray-500">{generatingStatus === "Waiting" ? "Waiting..." : "Loading..."}</p>
              </div>
            ) : (
              <NoImage />
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default OriginalImageViewer;
