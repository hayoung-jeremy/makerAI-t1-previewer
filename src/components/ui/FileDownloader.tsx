import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

import { Download } from "../icons";
import { cls } from "../../utils";
import { ModelData } from "../../hooks/useModelData";
import useDisplay from "../../hooks/useDisplay";

interface Props {
  modelData: ModelData | null;
}

const FileDownloader = ({ modelData }: Props) => {
  const { isDesktop } = useDisplay();

  const filteredFiles = modelData?.resultFiles.filter(
    file => file.endsWith("remeshed-texture.glb") || file.endsWith(".zip")
  );

  const getDisplayName = (filename: string) => {
    if (filename.endsWith("remeshed-texture.glb")) {
      return "RESULT 3D MODEL";
    } else if (filename.endsWith(".zip")) {
      return "RESULT ZIP FILE";
    } else {
      return filename; // 이 경우는 발생하지 않지만, 혹시 모르니 기본 반환값을 유지
    }
  };
  return (
    <div>
      <h2 className="text-[18px] mb-2 text-gray-400">FileDownloader</h2>
      <ul className="flex flex-col gap-2">
        {modelData &&
          filteredFiles &&
          filteredFiles.map((file, index) => (
            <Tippy
              key={`resultfile${index}`}
              content={file}
              animation="shift-away"
              placement={isDesktop ? "left" : "top"}
            >
              <li
                className={cls(
                  "flex items-center justify-center gap-3 px-4 rounded border transition-all",
                  "border-white/20 xl:hover:border-white text-white/60 xl:hover:text-white"
                )}
              >
                <Download />
                <a href={`${modelData.base_url}/${file}`} download={file} className="block py-2 truncate w-full">
                  {getDisplayName(file)}
                </a>
              </li>
            </Tippy>
          ))}
      </ul>
    </div>
  );
};

export default FileDownloader;
