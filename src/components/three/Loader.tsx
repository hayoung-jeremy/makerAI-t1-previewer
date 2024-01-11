import { Html } from "@react-three/drei";

interface Props {
  isLoading: boolean;
  isGenerating: boolean;
  isWaitingForQue: boolean;
}

const Loader = ({ isLoading, isGenerating, isWaitingForQue }: Props) => {
  return (
    <Html transform>
      <h1 style={{ textShadow: "0px 0px 2px #ffffff80" }} className="text-[12px] text-white ">
        {isLoading && "Loading..."}
        {isGenerating && "Generating..."}
        {isWaitingForQue && "Waiting for previous work..."}
      </h1>
    </Html>
  );
};

export default Loader;
