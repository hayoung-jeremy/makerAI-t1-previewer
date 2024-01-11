import { SpinningLoader } from ".";
import { PreviewData } from "../../hooks/useModelData";

interface Props {
  isCompleted: boolean;
  isWaitingForQue: boolean;
  isLoading: boolean;
  previewData: PreviewData | null;
}

const Previewer = ({ isCompleted, isWaitingForQue, isLoading, previewData }: Props) => {
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
        {previewData &&
          !isLoading &&
          previewData.images.map((image, index) => {
            if (image.endsWith(".mp4") && isCompleted) {
              return (
                <video key={index} autoPlay muted loop style={{ maxWidth: "100%" }}>
                  <source src={previewData.base_url + image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              );
            } else if (image.endsWith(".png") && !isCompleted) {
              return (
                <img
                  key={index}
                  src={previewData.base_url + image}
                  alt="미리보기 이미지"
                  style={{ maxWidth: "100%" }}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default Previewer;
