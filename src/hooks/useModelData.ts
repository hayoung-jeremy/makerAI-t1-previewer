import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const apiUrl = "http://10.190.140.55:8086";
const previewUrl = `${apiUrl}/preview/`;
const statusUrl = `${apiUrl}/status/`;
const resultUrl = `${apiUrl}/result/`;

const INTERVAL_TIME = 3000;

export interface ModelData {
  baseUrl: string;
  result: number;
  resultFiles: string[];
  uploadId: string;
}

export interface PreviewData {
  baseUrl: string;
  video: string;
}

export interface StatusData {
  progressRatio: number;
  waitingCount: number;
  originalImage: string | null;
  removeBgImage: string | null;
}

const useModelData = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const uploadId = pathname.split("/").pop();

  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForQue, setIsWaitingForQue] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [textureModifiedModelURL, setTextureModifiedModelURL] = useState("");

  const getPreview = useCallback(
    () =>
      fetch(previewUrl + uploadId)
        .then(res => res.json())
        .then((data: PreviewData) => setPreviewData(data))
        .catch(err => {
          setIsLoading(true);
          console.log("Preview API Call Error", err);
        }),
    [uploadId]
  );

  const getResultfiles = useCallback(() => {
    // 진행률 정보 없음
    // if (statusData === null) {
    fetch(resultUrl + uploadId)
      .then(res => res.json())
      .then((data: ModelData) => {
        if (data.resultFiles.includes("model-modified-texture.glb")) {
          setModelData(data);
          getPreview();
          setIsCompleted(true);
        }
      })
      .catch(err => {
        console.log("Result API Call Error", err);
        setIsLoading(true);
      });
    // }
  }, [getPreview, uploadId]);

  const getStatus = useCallback(() => {
    if (!uploadId || isCompleted) return;
    fetch(statusUrl + uploadId)
      .then(res => res.json())
      .then((data: StatusData) => {
        // 대기열 상태
        if (data.waitingCount > 0) {
          setIsWaitingForQue(true);
          setIsLoading(false);
          setStatusData(data);
        } else if (data.waitingCount < 0) {
          //
        }

        // 진행률 값이 정상적인 경우에 대한 UI 처리 ( 100% 포함 )
        else {
          setIsGenerating(true);
          setIsLoading(false);
          setIsWaitingForQue(false);
          setStatusData(data);
          // 100% 인 경우에는 여기서 최종 완료 체크
          if (data.progressRatio === 100) {
            // setModelData(null);
            getResultfiles();
          }
        }
      })
      .catch(err => {
        // 오류가 발생하는 케이스
        // 1. 진행률이 0 일 때
        // 2. 진행률이 99.5 이상일 때
        // 위 2가지 케이스는 구분할 수 없음
        // 그러므로 하나의 UI 로 퉁쳐야 함
        console.log("진행률 0 or 99.5일 때 : ", err);
        setIsLoading(true);
        setIsGenerating(false);
        setIsWaitingForQue(false);
        if (!isCompleted) {
          // "model-modified-texture.glb" 파일이 결과 파일 목록에 있으면 isCompleted 를 true 로 처리함
          getResultfiles();
        }
        console.log("checking temporary status...");
      });
  }, [isCompleted, uploadId, getResultfiles]);

  // get status
  useEffect(() => {
    const interval = setInterval(getStatus, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [getStatus]);

  // get preview
  useEffect(() => {
    if (!uploadId || isWaitingForQue || isLoading || isCompleted) return;

    const interval = setInterval(getPreview, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [uploadId, isCompleted, isWaitingForQue, isLoading, getPreview]);

  useEffect(() => {
    if (!modelData) return;
    const modifiedModelFile = modelData.resultFiles.find((file: string) => file === "model-modified-texture.glb");
    setTextureModifiedModelURL(`${modelData.baseUrl}/${modifiedModelFile}`);
  }, [modelData]);

  return {
    isLoading,
    isGenerating,
    isCompleted,
    isWaitingForQue,
    modelData,
    previewData,
    statusData,
    textureModifiedModelURL,
  };
};

export default useModelData;
