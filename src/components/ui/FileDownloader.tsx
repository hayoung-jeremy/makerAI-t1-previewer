import { SpinningLoader } from ".";
import { Download } from "../icons";
import { ModelData } from "../../hooks/useModelData";
import { cls } from "../../utils";

interface Props {
  modelData: ModelData | null;
  isLoading: boolean;
}

const FileDownloader = ({ modelData, isLoading }: Props) => {
  if (!isLoading && modelData && modelData.resultFiles.length === 0) {
    return <div>No files available for download.</div>;
  }

  return (
    <div>
      <h2 className="text-[18px] mb-2">FileDownloader</h2>
      {isLoading && (
        <div className="flex items-center justify-start gap-2">
          <SpinningLoader width={16} height={16} loaderBgColor="text-gray-500" />
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {modelData &&
          modelData.resultFiles.map((file, index) => (
            <li
              key={index}
              className={cls(
                "flex items-center justify-center gap-3 px-4 rounded border transition-all",
                file.includes("model-modified-texture.glb")
                  ? "border-blue-300/60 text-blue-300/80 hover:border-blue-300 hover:text-blue-300"
                  : "border-white/20 hover:border-white text-white/60 hover:text-white"
              )}
            >
              <Download />
              <a href={`${modelData.base_url}/${file}`} download={file} className="block py-2 truncate w-full">
                {file}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FileDownloader;
