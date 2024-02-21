import { useState } from "react";
import { motion } from "framer-motion";
import { SpinningLoader } from ".";
import { PreviewData } from "../../hooks/useModelData";

interface Props {
  previewData: PreviewData | null;
  isCompleted: boolean;
  isWaitingForQue: boolean;
  isLoading: boolean;
}

const Previewer = ({ previewData, isWaitingForQue, isLoading }: Props) => {
  const [isGifLoaded, setIsGifLoaded] = useState(false);

  return (
    <div>
      <h2 className="text-[18px] mb-2">Preview</h2>
      <div className="flex flex-col gap-[2px] rounded-xl overflow-hidden">
        {(isLoading || isWaitingForQue || !isGifLoaded) && (
          <div className="flex items-center justify-start gap-2">
            <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
            <p className="text-gray-500">
              {isWaitingForQue ? "Waiting..." : previewData?.gif === "" ? "Creating a preview" : "Loading..."}
            </p>
          </div>
        )}
        {previewData && previewData.gif !== "" && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={previewData.baseUrl + "/" + previewData.gif}
            alt="preview gif"
            className="w-full"
            onLoad={() => {
              console.log("gif loaded");
              setIsGifLoaded(true);
            }}
            onError={() => {
              console.log("gif error");
              setIsGifLoaded(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Previewer;
