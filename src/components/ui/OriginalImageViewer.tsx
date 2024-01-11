import { NoImage } from "../icons";
import { SpinningLoader } from ".";
import { StatusData } from "../../hooks/useModelData";

interface Props {
  statusData: StatusData | null;
  isLoading: boolean;
  isWaitingForQue: boolean;
}

const OriginalImageViewer = ({ statusData, isLoading, isWaitingForQue }: Props) => {
  return (
    <aside className="">
      <div className="grid grid-cols-2">
        <p className="mb-2 text-[18px]">Original image</p>
        <p className="mb-2 text-[18px]">Bg removed image</p>
      </div>
      <div className="w-full grid grid-cols-2">
        {statusData && statusData.original_image && !isLoading && (
          <div className="border border-white/20 overflow-hidden rounded-l-xl">
            <img src={statusData.original_image} className="w-full" />
          </div>
        )}
        {statusData && statusData.remove_bg_image && !isLoading && (
          <div className="border border-white/20 overflow-hidden rounded-r-xl">
            <img src={statusData.remove_bg_image} className="w-full" />
          </div>
        )}
        {(isLoading || isWaitingForQue) && (
          <div className="flex items-center justify-start gap-2">
            <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
            <p className="text-gray-500">{isWaitingForQue ? "Waiting..." : "Loading..."}</p>
          </div>
        )}
        {!statusData && !isWaitingForQue && !isLoading && (
          <>
            <div className="flex items-center justify-start h-[40px] text-gray-500">
              <NoImage />
            </div>
            <div className="flex items-center justify-start h-[40px] text-gray-500">
              <NoImage />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default OriginalImageViewer;
