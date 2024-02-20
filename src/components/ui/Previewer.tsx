import { SpinningLoader } from ".";
import { PreviewData } from "../../hooks/useModelData";

interface Props {
  isCompleted: boolean;
  isWaitingForQue: boolean;
  isLoading: boolean;
  previewData: PreviewData | null;
}

const Previewer = ({ isWaitingForQue, isLoading, previewData }: Props) => {
  return (
    <div>
      <h2 className="text-[18px] mb-2">Preview</h2>
      <div className="flex flex-col gap-[2px] rounded-xl overflow-hidden">
        {(isLoading || isWaitingForQue) && (
          <div className="flex items-center justify-start gap-2">
            <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
            <p className="text-gray-500">{isWaitingForQue ? "Waiting..." : "Loading..."}</p>
          </div>
        )}
        {previewData && (
          <video autoPlay muted loop style={{ maxWidth: "100%" }}>
            <source src={`${previewData.baseUrl}/${previewData.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default Previewer;
