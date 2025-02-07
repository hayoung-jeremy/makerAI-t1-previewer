import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import {
  OriginalImageViewer,
  Previewer,
  StatusViewer,
  ToggleToSeeWireframeButton,
  FileDownloader,
  WaitingForQueue,
  ResultModelSelector,
} from "./components/ui";
import { DistortLoader, EnvironmentSettings, ModelViewer, ProgressLoader } from "./components/three";

import { cls } from "./utils";
import useModelData from "./hooks/useModelData";
import useDisplay from "./hooks/useDisplay";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const { modelData, statusData, previewData, generatingStatus, originalImgURL, removedBGImgURL, resultModels } =
    useModelData();
  const { isMobile } = useDisplay();

  useEffect(() => {
    console.log("resultModels : ", resultModels);
  }, [resultModels, modelData]);

  return (
    <main className="h-screen flex overflow-hidden">
      <div className="w-[100%]">
        <Canvas camera={{ fov: 60, position: [0, 0, 2] }} gl={{ antialias: true }} dpr={[1, 2]}>
          <Suspense fallback={<ProgressLoader />}>
            {modelData && generatingStatus === "Completed" && resultModels.length > 0 && (
              <ModelViewer modelUrl={resultModels[selectedTab].url} />
            )}
            {generatingStatus === "Generating" && <DistortLoader statusData={statusData} />}
            <EnvironmentSettings isCompleted={generatingStatus === "Completed"} />
          </Suspense>
        </Canvas>
      </div>
      <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-[20px] md:text-[32px] xl:text-[48px] select-none w-full text-center flex flex-col items-center justify-center gap-1">
        {generatingStatus === "Loading" ? (
          <p style={{ textShadow: "0px 0px 8px #ffffff80" }}>Loading...</p>
        ) : generatingStatus === "Waiting" ? (
          <WaitingForQueue waitingCount={statusData?.waitingCount ?? 0} />
        ) : (
          ""
        )}
      </div>

      {generatingStatus === "Completed" && (
        <ResultModelSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} resultModels={resultModels} />
      )}

      <aside
        className={cls(
          "fixed top-0 right-0 select-none",
          "w-screen",
          "md:max-w-[360px]",
          "xl:w-[20%] xl:max-w-none xl:min-w-[360px]",
          "bg-[#212121]",
          "shadow-[-12px_0px_12px_8px_#00000024]",
          "transition-all duration-300",
          isSideBarOpen ? "" : "translate-x-[100%]"
        )}
      >
        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-6 h-screen">
          <StatusViewer statusData={statusData} />
          <OriginalImageViewer
            generatingStatus={generatingStatus}
            originalImgURL={originalImgURL}
            removedBGImgURL={removedBGImgURL}
          />
          {generatingStatus !== "Completed" && (
            <Previewer previewData={previewData} generatingStatus={generatingStatus} />
          )}
          {generatingStatus === "Completed" && <FileDownloader modelData={modelData} />}
        </div>

        {modelData && generatingStatus === "Completed" && (
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

        {isMobile && (
          <button
            onClick={() => setIsSideBarOpen(false)}
            className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </aside>
    </main>
  );
}

export default App;
