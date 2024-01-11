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
            statusData?.progress_ratio && statusData?.progress_ratio > 0 ? "text-blue-300" : "text-gray-500"
          )}
        >
          {statusData?.progress_ratio ?? 0}%
        </span>
      </p>
      {statusData?.waiting_count && (
        <p>
          <span className="text-[18px]">Queue</span> :{" "}
          {statusData.waiting_count > 0 && (
            <span className="text-red-400 font-semibold">{statusData?.waiting_count}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default StatusViewer;
