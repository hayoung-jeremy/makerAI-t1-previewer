import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const apiUrl = "http://10.190.140.55:8086";
const previewUrl = `${apiUrl}/preview/`;
const statusUrl = `${apiUrl}/status/`;
const resultUrl = "https://ai-result.altava.com/result/5/";

const INTERVAL_TIME = 2000;

export interface ModelData {
  base_url: string;
  result: number;
  resultFiles: string[];
  uploadId: string;
}

export interface PreviewData {
  baseUrl: string;
  video: string;
}

export interface StatusData {
  progressRatio: string;
  waitingCount: number;
  originalImage: string | null;
  removeBgImage: string | null;
}

const useModelData = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const uploadId = pathname.split("/").pop();

  const intervalId = useRef<number | undefined>(undefined);

  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForQue, setIsWaitingForQue] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [textureModifiedModelURL, setTextureModifiedModelURL] = useState("");
  const [originalImgURL, setOriginalImgURL] = useState("");
  const [removedBGImgURL, setRemovedBGImgURL] = useState("");
  const [previousVideoUrl, setPreviousVideoUrl] = useState("");

  const getPreview = useCallback(
    () =>
      fetch(previewUrl + uploadId)
        .then(res => res.json())
        .then((data: PreviewData) => {
          console.log("Preview data : ", data);
          setPreviewData(data);
        })
        .catch(err => {
          setIsLoading(true);
          console.log("Preview API Call Error", err);
        }),
    [uploadId]
  );

  const getResultfiles = useCallback(() => {
    fetch(resultUrl + uploadId)
      .then(res => res.json())
      .then((data: ModelData) => {
        console.log("ModelData : ", data);
        if (data.resultFiles.some(file => file.endsWith(".zip"))) {
          setModelData(data);
          getPreview();

          const originalImgFile = data.resultFiles.filter(file => {
            const lowerCaseFile = file.toLowerCase();
            return (
              (lowerCaseFile.endsWith(".png") || lowerCaseFile.endsWith(".jpg") || lowerCaseFile.endsWith(".jpeg")) &&
              !lowerCaseFile.endsWith("_albedo.png") &&
              !lowerCaseFile.endsWith("_rgba.png")
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

          setIsCompleted(true);
        }
      })
      .catch(err => {
        console.log("Result API Call Error", err);
        setIsLoading(true);
      });
  }, [getPreview, uploadId]);

  const getStatus = useCallback(() => {
    fetch(statusUrl + uploadId)
      .then(res => res.json())
      .then((data: StatusData) => {
        console.log("Status data : ", data);
        // 대기열 상태
        if (data.waitingCount > 0) {
          setIsWaitingForQue(true);
          setIsLoading(false);
          setStatusData(data);
        }
        // 완료
        else if (data.waitingCount < 0 && data.progressRatio === "100") {
          console.log("완료");
          getResultfiles();
        }
        // 생성중
        else {
          setIsGenerating(true);
          setIsLoading(false);
          setIsWaitingForQue(false);
          setStatusData(data);

          if (data.originalImage && data.removeBgImage) {
            setOriginalImgURL(data.originalImage);
            setRemovedBGImgURL(data.removeBgImage); // 100% 인 경우에는 여기서 최종 완료 체크
          }
          if (data.progressRatio === "100") {
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
      })
      .finally(() => {
        if (intervalId.current) clearTimeout(intervalId.current);
        setIsLoading(false);
        setIsGenerating(false);
        setIsWaitingForQue(false);
      });
  }, [isCompleted, uploadId, getResultfiles]);

  // get status
  useEffect(() => {
    if (!uploadId || isCompleted) return;

    const fetchStatus = () => {
      getStatus();
      intervalId.current = window.setTimeout(fetchStatus, INTERVAL_TIME);
    };

    fetchStatus();

    return () => {
      if (intervalId.current) clearTimeout(intervalId.current);
    };
  }, [getStatus, uploadId, isCompleted]);

  // get preview
  useEffect(() => {
    if (!uploadId || isWaitingForQue || isLoading || isCompleted) return;

    const fetchPreview = () => {
      getPreview();
      intervalId.current = window.setTimeout(fetchPreview, INTERVAL_TIME);
    };

    fetchPreview();

    return () => {
      if (intervalId.current) clearTimeout(intervalId.current);
    };
  }, [uploadId, isCompleted, isWaitingForQue, isLoading, getPreview]);

  useEffect(() => {
    if (!modelData) return;
    const modifiedModelFile = modelData.resultFiles.find((file: string) => file.endsWith("remeshed-texture.glb"));
    setTextureModifiedModelURL(`${modelData.base_url}/${modifiedModelFile}`);
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
    originalImgURL,
    removedBGImgURL,
    previousVideoUrl,
  };
};

export default useModelData;
