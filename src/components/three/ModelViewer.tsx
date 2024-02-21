import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import { useWireframeStore } from "../../store";

interface Props {
  modelUrl: string;
}

const ModelViewer = ({ modelUrl }: Props) => {
  const glb = useLoader(GLTFLoader, modelUrl);
  const toggleToSeeWireframe = useWireframeStore(state => state.toggleToSeeWireframe);

  useEffect(() => {
    glb.scene.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        const meshMaterial = obj.material;
        meshMaterial.wireframe = toggleToSeeWireframe;

        if (toggleToSeeWireframe) {
          // 원래의 material을 저장합니다.
          obj.userData.originalMaterial = meshMaterial;

          // MeshStandardMaterial로 변경하고 색상을 하얗게 설정합니다.
          const whiteMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          });
          obj.material = whiteMaterial;
        } else {
          // 원래의 material로 되돌립니다.
          if (obj.userData.originalMaterial) {
            obj.material = obj.userData.originalMaterial;
            obj.material.wireframe = false;
          }
        }
      }
    });
  }, [glb.scene, toggleToSeeWireframe]);

  return (
    <Float
      speed={4} // Animation speed, defaults to 1
      rotationIntensity={0.4} // XYZ rotation intensity, defaults to 1
      floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    >
      <primitive object={glb.scene} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />
    </Float>
  );
};

export default ModelViewer;
