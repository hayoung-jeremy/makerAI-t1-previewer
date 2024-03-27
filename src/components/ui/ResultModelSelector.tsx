import { Dispatch, SetStateAction } from "react";
import { ResultModels } from "@/hooks/useModelData";
import { cls } from "@/utils";

interface Props {
  selectedTab: number;
  setSelectedTab: Dispatch<SetStateAction<number>>;
  resultModels: ResultModels[];
}

const ResultModelSelector = ({ selectedTab, setSelectedTab, resultModels }: Props) => {
  const tabLabels = {
    Original: "Original",
    Remeshed: "Remeshed",
  };
  const tabs = resultModels.map(model => tabLabels[model.type]);

  return (
    <aside className="fixed bottom-7 xl:bottom-[10vh] 2xl:bottom-[5vh] left-1/2 translate-x-[-50%]">
      <ul className={cls(resultModels.length > 1 ? "grid grid-cols-2" : "grid-cols-1", "rounded relative")}>
        <li
          className={cls(
            "absolute top-0 z-[0]",
            selectedTab === 0 ? "left-0" : "left-1/2",
            "h-full",
            resultModels.length > 1 ? "w-1/2" : "w-full",
            "border rounded",
            "shadow-[0px_0px_12px_4px_#ffffff12]",
            "backdrop-blur-sm",
            "transition-all duration-300"
          )}
        ></li>
        {tabs.map((label, index) => (
          <li
            key={index}
            className={cls(
              "relative z-[1]",
              "select-none",
              "cursor-pointer",
              "flex items-center justify-center",
              "transition-all duration-200",
              "py-2 px-4",
              selectedTab === index ? "text-white" : "text-white/60"
            )}
            onClick={() => setSelectedTab(index)}
          >
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ResultModelSelector;
