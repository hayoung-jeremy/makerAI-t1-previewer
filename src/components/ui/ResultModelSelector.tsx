import { cls } from "@/utils";
import { Dispatch, SetStateAction } from "react";

interface Props {
  selectedTab: number;
  setSelectedTab: Dispatch<SetStateAction<number>>;
}

const ResultModelSelector = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <aside className="fixed bottom-7 xl:bottom-[10vh] 2xl:bottom-[5vh] left-1/2 translate-x-[-50%]">
      <ul className="grid grid-cols-2 rounded relative">
        <li
          className={cls(
            "absolute top-0 z-[0]",
            selectedTab === 0 ? "left-0" : "left-1/2",
            "h-full w-1/2",
            "border rounded",
            "shadow-[0px_0px_12px_4px_#ffffff12]",
            "backdrop-blur-sm",
            "transition-all duration-300"
          )}
        ></li>
        {Array.from({ length: 2 }).map((_, index) => (
          <li
            key={index}
            className={cls(
              "z-[1]",
              "select-none",
              "cursor-pointer",
              "flex items-center justify-center",
              "transition-all duration-200",
              "py-2 px-4",
              selectedTab === index ? "text-white" : "text-white/60"
            )}
            onClick={() => setSelectedTab(index)}
          >
            {index === 0 ? "Original" : "Remeshed"}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ResultModelSelector;
