"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PropTypes from 'prop-types';

export default function RobotModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot.glb");
  const { actions, mixer } = useAnimations(animations, group);
  
  const [message, setMessage] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const fullMessage = "Hi, I'm Mindbot! Click me !";

  useEffect(() => {
    let i = 0;
    let interval;
    let loop;
    let cursorInterval;

    const startTyping = () => {
      setMessage("");
      i = 0;

      interval = setInterval(() => {
        setMessage(fullMessage.slice(0, i++));
        if (i > fullMessage.length) {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, 45);
    };

    startTyping();

    loop = setInterval(() => {
      setShowCursor(true);
      startTyping();
    }, 10000);

    cursorInterval = setInterval(() => {
      if (i > fullMessage.length) {
        setShowCursor(prev => !prev);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(loop);
      clearInterval(cursorInterval);
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

  const handleRobotClick = () => {
    props.onRobotClick();
  };

  return (
    <group 
      ref={group} 
      {...props} 
      onClick={handleRobotClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <primitive
        object={scene}
        scale={1.5}
        position={[0, -0.9, 0]}
        castShadow
        receiveShadow
      />
      <Html 
        position={[0.9, 1.5, 0]} 
        center 
        distanceFactor={10}
        style={{
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <div className="relative w-[150px] min-h-[60px] px-4 py-3 rounded-2xl border border-purple-400 bg-gradient-to-br from-[#2d1f4d] to-[#3b0f78] text-white text-xs font-medium shadow-xl">
          <div className="absolute -left-3 top-4 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-[#3b0f78]"></div>
          <p className="whitespace-pre-wrap leading-tight">
            {message}
            {showCursor && <span className="ml-1 inline-block w-1 h-4 bg-purple-300 animate-pulse"></span>}
          </p>
        </div>
      </Html>
    </group>
  );
}

RobotModel.propTypes = {
  onRobotClick: PropTypes.func.isRequired
};