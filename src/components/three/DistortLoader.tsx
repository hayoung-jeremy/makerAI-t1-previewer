/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, MeshDistortMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import { motion } from "framer-motion";

import { cls } from "../../utils";
import { StatusData } from "../../hooks/useModelData";

interface Props {
  statusData: StatusData | null;
}

const DistortLoader = ({ statusData }: Props) => {
  const ref = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const [hovered, hover] = useState(false);

  useFrame(() => {
    if (!ref.current || !meshRef.current) return;
    ref.current.distort = MathUtils.lerp(ref.current.distort, hovered ? 0.4 : 0.25, hovered ? 0.05 : 0.01);

    const targetScale = hovered ? 1.15 : 1; // 마우스 오버 시 1.15배, 아닐 때는 원래 크기(1배)
    meshRef.current.scale.x = MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    meshRef.current.scale.z = MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
  });
  return (
    <group>
      <Float
        speed={4} // Animation speed, defaults to 1
        rotationIntensity={0} // XYZ rotation intensity, defaults to 1
        floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        {statusData && (
          <Html transform position={[0, -0.8, 0]} scale={0.5} zIndexRange={[0, 0]}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p style={{ textShadow: "0px 0px 2px #ffffff80" }} className="text-[12px] text-center mb-1">
                {Math.floor(Number(statusData?.progressRatio))}%
              </p>
              <div className="relative left-1/2 translate-x-[-50%] w-[40px] h-[1px] bg-white/20">
                <div
                  style={{ width: statusData?.progressRatio + "%" }}
                  className={cls(
                    "absolute h-full bg-white transition-all duration-300",
                    Number(statusData?.progressRatio) > 0 ? "shadow-[0px_0px_3px_1px_#ffffff60]" : ""
                  )}
                ></div>
              </div>
            </motion.div>
          </Html>
        )}
      </Float>
      <mesh ref={meshRef} position={[0, 0, 0]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshDistortMaterial ref={ref} speed={5} clearcoat={1} metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
};

export default DistortLoader;
