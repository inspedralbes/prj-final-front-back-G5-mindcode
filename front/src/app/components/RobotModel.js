"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function RobotModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const [message, setMessage] = useState("");
  const fullMessage = "Welcome to Mindcode! I'm Mindbot! Curious about us? Tap the link and explore ✨";

  useEffect(() => {
    let i = 0;
    let interval;
    let loop;
  
    const startTyping = () => {
      setMessage(""); 
      i = 0;
  
      interval = setInterval(() => {
        setMessage(fullMessage.slice(0, i++));
        if (i > fullMessage.length) {
          clearInterval(interval);
        }
      }, 45);
    };
  
    startTyping(); 
  
    loop = setInterval(() => {
      startTyping();
    }, 8000);
  
    return () => {
      clearInterval(interval);
      clearInterval(loop);
    };
  }, []);

  useEffect(() => {
    if (actions && actions["Idle"]) {
      actions["Idle"].play();
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
    <>
      <primitive
        ref={group}
        object={scene}
        scale={1.5}
        position={[0, -0.9, 0]}
        castShadow
        receiveShadow
      />

      <Html position={[2.5, 1.2, 0]} center distanceFactor={10}>
        <div className="relative w-[150px] min-h-[100px] px-5 py-4 rounded-2xl border border-purple-400 bg-gradient-to-br from-[#2d1f4d] to-[#3b0f78] text-white text-base font-medium shadow-xl animate-fade transition-all duration-500">
          
          <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-[#3b0f78]"></div>

          <p className=" text-[10px] whitespace-pre-wrap leading-relaxed">{message}</p>
        </div>
      </Html>
    </>
  );
}
