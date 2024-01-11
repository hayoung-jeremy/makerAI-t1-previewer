import { Environment } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const EnvironmentSettings = () => {
  return (
    <>
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.1} />
      </EffectComposer>
      <color args={["#212224"]} attach="background" />
      {/* <ambientLight intensity={0.1} /> */}
      <directionalLight intensity={0.8} position={[2, 2, 2]} />
      <Environment preset="city" />
    </>
  );
};

export default EnvironmentSettings;
