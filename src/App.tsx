import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";

import {
  OriginalImageViewer,
  Previewer,
  StatusViewer,
  ToggleToSeeWireframeButton,
  FileDownloader,
} from "./components/ui";
import { EnvironmentSettings, Loader, ModelViewer } from "./components/three";
import useModelData from "./hooks/useModelData";
import { cls } from "./utils";

function App() {
  const {
    textureModifiedModelURL,
    modelData,
    statusData,
    previewData,
    isLoading,
    isGenerating,
    isCompleted,
    isWaitingForQue,
  } = useModelData();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  useEffect(() => {
    console.log(" ");
    console.log(
      "================================================= START ================================================="
    );
    console.log("------------------------------ data ------------------------------");
    console.log("model Data : ", modelData);
    console.log("statusData : ", statusData);
    console.log("previewData : ", previewData);
    console.log("------------------------------ status ------------------------------");
    console.log("isLoading : ", isLoading);
    console.log("isGenerating : ", isGenerating);
    console.log("isWaitingForQue : ", isWaitingForQue);
    console.log("isCompleted : ", isCompleted);
    console.log(
      "================================================== END =================================================="
    );
    console.log(" ");
  }, [modelData, statusData, previewData, isCompleted, isLoading, isGenerating, isWaitingForQue]);

  return (
    <main className="h-screen flex overflow-hidden">
      <div className="w-[100%]">
        <Canvas camera={{ fov: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
          {/* <ModelViewer modelUrl={textureModifiedModelURL} /> */}
          {modelData && isCompleted && textureModifiedModelURL !== "" && textureModifiedModelURL !== undefined ? (
            <ModelViewer modelUrl={textureModifiedModelURL} />
          ) : (
            <Loader isLoading={isLoading} isGenerating={isGenerating} isWaitingForQue={isWaitingForQue} />
          )}
          <CameraControls
            enabled
            minDistance={2}
            maxDistance={4}
            mouseButtons={{ left: 1, middle: 8, right: 0, wheel: 8 }}
            touches={{ one: 32, two: 256, three: 0 }}
            smoothTime={0.2}
            draggingSmoothTime={0.2}
          />
          <EnvironmentSettings />
        </Canvas>
      </div>

      <aside
        className={cls(
          "fixed top-0 right-0",
          "w-screen",
          "md:max-w-[360px]",
          "xl:w-[20%] xl:max-w-none xl:min-w-[360px]",
          "bg-[#222]",
          "shadow-[-12px_0px_12px_8px_#00000024]",
          "transition-all duration-300",
          isSideBarOpen ? "" : "translate-x-[100%]"
        )}
      >
        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-6 h-screen">
          <StatusViewer statusData={statusData} />
          <OriginalImageViewer statusData={statusData} isLoading={isLoading} isWaitingForQue={isWaitingForQue} />
          <Previewer
            previewData={previewData}
            isLoading={isLoading}
            isWaitingForQue={isWaitingForQue}
            isCompleted={isCompleted}
          />
          {isCompleted && <FileDownloader modelData={modelData} isLoading={isLoading} />}
        </div>

        {modelData && isCompleted && (
          <div className="absolute top-[20px] left-[-72px]">
            <ToggleToSeeWireframeButton />
          </div>
        )}

        <div className="group absolute top-[50%] left-[-80px] translate-y-[-50%] z-[999999]">
          <button
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="w-[48px] h-[120px] transition-all duration-300 flex flex-col items-center justify-center"
          >
            <span
              className={cls(
                "w-[2px] h-[28px] bg-[#666] group-hover:bg-white rounded-full",
                "transition-all duration-300",
                isSideBarOpen ? "rotate-[-30deg] translate-y-[2px]" : "rotate-[30deg] translate-y-[2px]"
              )}
            ></span>
            <span
              className={cls(
                "w-[2px] h-[28px] bg-[#666] group-hover:bg-white rounded-full",
                "transition-all duration-300",
                isSideBarOpen ? "rotate-[30deg] translate-y-[-2px]" : "rotate-[-30deg] translate-y-[-2px]"
              )}
            ></span>
          </button>
        </div>
      </aside>
    </main>
  );
}

export default App;
