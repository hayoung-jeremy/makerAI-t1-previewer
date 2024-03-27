import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "@react-three/fiber";
import { Box3, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import { useWireframeStore } from "../../store";

interface Props {
  modelUrl: string;
}

const ModelViewer = ({ modelUrl }: Props) => {
  const { pathname } = useLocation();
  const uploadId = pathname.split("/").pop();

  const modelRef = useRef<Object3D>(null);
  const [gridPosition, setGridPosition] = useState<Vector3>(new Vector3(0, 0, 0));

  const glb = useLoader(GLTFLoader, modelUrl);
  const toggleToSeeWireframe = useWireframeStore(state => state.toggleToSeeWireframe);

  useEffect(() => {
    const scene = glb.scene;
    scene.traverse((obj: Object3D) => {
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

    const bbox = new Box3().setFromObject(scene);
    const height = bbox.max.y - bbox.min.y;
    setGridPosition(new Vector3(0, -height / 2, 0)); // Grid를 모델 아래로 이동
  }, [glb.scene, toggleToSeeWireframe]);

  return (
    <>
      <primitive
        ref={modelRef}
        object={glb.scene}
        rotation={uploadId === "2024022315232417" ? [0, 0, 0] : [-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <gridHelper args={[10, 10]} position={gridPosition} />
    </>
  );
};

export default ModelViewer;
