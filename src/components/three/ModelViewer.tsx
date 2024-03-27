import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "@react-three/fiber";
import { Box3, Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import { useWireframeStore } from "../../store";

interface Props {
  modelUrl: string;
}

const ModelViewer = ({ modelUrl }: Props) => {
  const { pathname } = useLocation();
  const uploadId = pathname.split("/").pop();

  const modelRef = useRef<Group>(null);
  const originalMaterialsRef = useRef<Map<Object3D, MeshStandardMaterial | MeshStandardMaterial[]>>(new Map());
  const [gridPosition, setGridPosition] = useState<Vector3>(new Vector3(0, 0, 0));

  const glb = useLoader(GLTFLoader, modelUrl);
  const toggleToSeeWireframe = useWireframeStore(state => state.toggleToSeeWireframe);

  useEffect(() => {
    const scene = glb.scene;

    scene.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        if (!originalMaterialsRef.current.has(obj)) {
          originalMaterialsRef.current.set(obj, obj.material);
        }

        const originalMaterial = originalMaterialsRef.current.get(obj);
        if (toggleToSeeWireframe) {
          // 와이어프레임 모드로 전환
          const whiteMaterial = new MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          });
          obj.material = whiteMaterial;
        } else if (originalMaterial) {
          // 원본 머티리얼로 복원
          obj.material = originalMaterial;
        }
      }

      if (modelRef.current) {
        const bbox = new Box3().setFromObject(modelRef.current);
        const height = bbox.max.y - bbox.min.y;

        console.log(" Height : ", height);

        setGridPosition(new Vector3(0, -height / 2, 0));
      }
    });
  }, [glb.scene, toggleToSeeWireframe, modelUrl]);

  return (
    <>
      <group ref={modelRef} rotation={uploadId === "2024022315232417" ? [0, 0, 0] : [-Math.PI / 2, 0, -Math.PI / 2]}>
        <primitive object={glb.scene} />
      </group>
      <gridHelper args={[10, 10]} position={gridPosition} />
    </>
  );
};

export default ModelViewer;
