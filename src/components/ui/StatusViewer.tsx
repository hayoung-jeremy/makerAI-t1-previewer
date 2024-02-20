import { StatusData } from "../../hooks/useModelData";
import { cls } from "../../utils";

interface Props {
  statusData: StatusData | null;
}

const StatusViewer = ({ statusData }: Props) => {
  return (
    <div className="grid grid-cols-2">
      <p>
        <span className="text-[18px]">Process</span> :{" "}
        <span
          className={cls(
            "font-semibold",
            statusData?.progressRatio && Number(statusData?.progressRatio) > 0 ? "text-blue-300" : "text-gray-500"
          )}
        >
          {statusData?.progressRatio ?? 0}%
        </span>
      </p>
      {statusData?.waitingCount && statusData.waitingCount > 0 ? (
        <p>
          <span className="text-[18px]">Queue</span> :{" "}
          {statusData.waitingCount > 0 && (
            <span className="text-red-400 font-semibold">{statusData?.waitingCount}</span>
          )}
        </p>
      ) : null}
    </div>
  );
};

export default StatusViewer;
