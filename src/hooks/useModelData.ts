import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const { VITE_API_URL, VITE_RESULT_URL } = import.meta.env;

const previewUrl = `${VITE_API_URL}/preview/`;
const statusUrl = `${VITE_API_URL}/status/`;
const resultUrl = `${VITE_RESULT_URL}/5/`;

const INTERVAL_TIME = 1000 * 5;

export interface ModelData {
  base_url: string;
  result: number;
  resultFiles: string[];
  uploadId: string;
}

export interface PreviewData {
  baseUrl: string;
  gif: string;
}

export interface StatusData {
  progressRatio: string;
  waitingCount: number;
  originalImage: string | null;
  removeBgImage: string | null;
}

export type GeneratingStatus = "Loading" | "Waiting" | "Generating" | "Completed";

type ResultModelType = "Original" | "Remeshed";
export interface ResultModels {
  type: ResultModelType;
  url: string;
}

const useModelData = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const uploadId = pathname.split("/").pop();

  const intervalId = useRef<number | undefined>(undefined);

  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [statusData, setStatusData] = useState<StatusData | null>(null);

  const [generatingStatus, setGeneratingStatus] = useState<GeneratingStatus>("Loading");

  const [resultModels, setResultModels] = useState<ResultModels[]>([]);
  const [originalImgURL, setOriginalImgURL] = useState("");
  const [removedBGImgURL, setRemovedBGImgURL] = useState("");

  const getPreview = useCallback(
    () =>
      fetch(previewUrl + uploadId)
        .then(res => res.json())
        .then((data: PreviewData) => setPreviewData(data))
        .catch(err => {
          setGeneratingStatus("Loading");
          console.log("Preview API Call Error", err);
        }),
    [uploadId]
  );

  const getResultfiles = useCallback(() => {
    fetch(resultUrl + uploadId)
      .then(res => res.json())
      .then((data: ModelData) => {
        // console.log("ModelData : ", data);
        if (data.resultFiles.some(file => file.endsWith(".zip"))) {
          setModelData(data);
          getPreview();

          const originalImgFile = data.resultFiles.filter(file => {
            const lowerCaseFile = file.toLowerCase();
            return (
              (lowerCaseFile.endsWith(".png") || lowerCaseFile.endsWith(".jpg") || lowerCaseFile.endsWith(".jpeg")) &&
              !lowerCaseFile.endsWith("_albedo.png") &&
              !lowerCaseFile.endsWith("_rgba.png") &&
              !lowerCaseFile.includes("texture_kd")
            );
          });

          const removedBGImgFile = data.resultFiles.filter(file => {
            const lowerCaseFile = file.toLowerCase();
            return lowerCaseFile.endsWith("_rgba.png");
          });

          if (originalImgFile) {
            setOriginalImgURL(`${data.base_url}/${originalImgFile}`);
          }

          if (removedBGImgFile) {
            setRemovedBGImgURL(`${data.base_url}/${removedBGImgFile}`);
          }

          setGeneratingStatus("Completed");
        }
      })
      .catch(err => {
        console.log("Result API Call Error", err);
        setGeneratingStatus("Loading");
      });
  }, [getPreview, uploadId]);

  const getStatus = useCallback(() => {
    fetch(statusUrl + uploadId)
      .then(res => res.json())
      .then((data: StatusData) => {
        // console.log("Status data : ", data);
        setStatusData(data);
        // 대기열 상태
        if (data.waitingCount > 0) {
          setGeneratingStatus("Waiting");
        }
        // 완료
        else if (data.waitingCount < 0 && data.progressRatio === "100") {
          getResultfiles();
          setGeneratingStatus("Completed");
          if (intervalId.current !== undefined) {
            clearTimeout(intervalId.current);
            intervalId.current = undefined;
          }
        }
        // 생성중
        else {
          setGeneratingStatus("Generating");

          if (data.originalImage && data.removeBgImage) {
            setOriginalImgURL(data.originalImage);
            setRemovedBGImgURL(data.removeBgImage); // 100% 인 경우에는 여기서 최종 완료 체크
          }
          if (data.progressRatio === "100") {
            getResultfiles();
            setGeneratingStatus("Completed");
          }
        }
      })
      .catch(() => {
        // 오류가 발생하는 케이스
        // 1. 진행률이 0 일 때
        // 2. 진행률이 99.5 이상일 때
        // 위 2가지 케이스는 구분할 수 없음
        // 그러므로 하나의 UI 로 퉁쳐야 함
        console.log("checking temporary status...");
      });
  }, [uploadId, getResultfiles]);

  // get status
  useEffect(() => {
    if (!uploadId || generatingStatus === "Completed") return;

    const fetchStatus = () => {
      getStatus();
      intervalId.current = window.setTimeout(fetchStatus, INTERVAL_TIME);
    };

    fetchStatus();

    return () => {
      if (intervalId.current) clearTimeout(intervalId.current);
    };
  }, [getStatus, uploadId, generatingStatus]);

  // get preview
  useEffect(() => {
    if (!uploadId || generatingStatus !== "Generating") return;

    const fetchPreview = () => {
      getPreview();
      intervalId.current = window.setTimeout(fetchPreview, INTERVAL_TIME);
    };

    fetchPreview();

    return () => {
      if (intervalId.current) clearTimeout(intervalId.current);
    };
  }, [getPreview, uploadId, generatingStatus]);

  useEffect(() => {
    if (!modelData) return;

    let originalModel: ResultModels = { type: "Original", url: "" };
    let remeshedModel: ResultModels = { type: "Remeshed", url: "" };

    modelData.resultFiles.forEach(file => {
      if (
        file.endsWith(".glb") &&
        !file.includes("texture") &&
        !file.includes("arranged") &&
        !file.includes("remeshed")
      ) {
        originalModel = { type: "Original", url: `${modelData.base_url}/${file}` };
      } else if (file.endsWith("remeshed-texture.glb")) {
        remeshedModel = { type: "Remeshed", url: `${modelData.base_url}/${file}` };
      }
    });

    const newModelURLs: ResultModels[] = [originalModel, remeshedModel].filter(model => model.url !== "");
    setResultModels(newModelURLs);
  }, [modelData]);

  return {
    generatingStatus,
    modelData,
    previewData,
    statusData,
    originalImgURL,
    removedBGImgURL,
    resultModels,
  };
};

export default useModelData;
