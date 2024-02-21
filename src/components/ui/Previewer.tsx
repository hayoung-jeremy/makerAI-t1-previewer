import { SpinningLoader } from ".";

interface Props {
  isCompleted: boolean;
  isWaitingForQue: boolean;
  isLoading: boolean;
  previousVideoUrl: string | null;
}

const Previewer = ({ isWaitingForQue, isLoading, previousVideoUrl }: Props) => {
  return (
    <div>
      <h2 className="text-[18px] mb-2">Preview</h2>
      <div className="flex flex-col gap-[2px] rounded-xl overflow-hidden">
        {(isLoading || isWaitingForQue || previousVideoUrl === "") && (
          <div className="flex items-center justify-start gap-2">
            <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
            <p className="text-gray-500">
              {isWaitingForQue ? "Waiting..." : previousVideoUrl === "" ? "Creating a preview" : "Loading..."}
            </p>
          </div>
        )}
        {previousVideoUrl && previousVideoUrl !== "" && <img src={previousVideoUrl} alt="preview gif" />}
      </div>
    </div>
  );
};

export default Previewer;
