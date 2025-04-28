import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function RobotModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF('/robot.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions['Idle']) {
      actions['Idle'].play();
    } else {
      const firstAnim = Object.values(actions)[0];
      firstAnim?.play();
    }

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = 0.6;
          child.material.roughness = 0.3;
        }
      }
    });
  }, [actions, scene]);

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.5}
      position={[0, -0.9, 0]}
      castShadow
      receiveShadow
    />
  );
}
