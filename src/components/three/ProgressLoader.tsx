import { Html, useProgress } from "@react-three/drei";

function ProgressLoader() {
  const { progress } = useProgress();

  return (
    <Html center zIndexRange={[0, 0]}>
      <p
        style={{ textShadow: "0px 0px 8px #ffffff80" }}
        className="text-[48px] leading-[48px] select-none flex items-center justify-center gap-4"
      >
        <span>{progress + "%"}</span>
        <span>Loaded</span>
      </p>
    </Html>
  );
}

export default ProgressLoader;
