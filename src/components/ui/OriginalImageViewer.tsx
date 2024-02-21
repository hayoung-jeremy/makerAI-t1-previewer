import { NoImage } from "../icons";
import { SpinningLoader } from ".";

interface Props {
  isLoading: boolean;
  isWaitingForQue: boolean;
  originalImgURL: string | null;
  removedBGImgURL: string | null;
}

const OriginalImageViewer = ({ isLoading, isWaitingForQue, originalImgURL, removedBGImgURL }: Props) => {
  return (
    <aside className="">
      <div className="grid grid-cols-2">
        <p className="mb-2 text-[18px]">Original image</p>
        <p className="mb-2 text-[18px]">Bg removed image</p>
      </div>
      <div className="w-full grid grid-cols-2">
        {originalImgURL && originalImgURL !== "" && !isLoading ? (
          <div className="border border-white/20 overflow-hidden rounded-l-xl">
            <img src={originalImgURL} alt="original image" className="w-full" />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-gray-500 border border-white/20 overflow-hidden rounded-l-xl">
            {isLoading || isWaitingForQue ? (
              <div className="flex items-center justify-start gap-2">
                <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
                <p className="text-gray-500">{isWaitingForQue ? "Waiting..." : "Loading..."}</p>
              </div>
            ) : (
              <NoImage />
            )}
          </div>
        )}
        {removedBGImgURL && removedBGImgURL !== "" && !isLoading ? (
          <div className="border border-white/20 overflow-hidden rounded-r-xl">
            <img src={removedBGImgURL} className="w-full" />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-gray-500 border border-white/20 border-l-0 overflow-hidden rounded-r-xl">
            {isLoading || isWaitingForQue ? (
              <div className="flex items-center justify-start gap-2">
                <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
                <p className="text-gray-500">{isWaitingForQue ? "Waiting..." : "Loading..."}</p>
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
