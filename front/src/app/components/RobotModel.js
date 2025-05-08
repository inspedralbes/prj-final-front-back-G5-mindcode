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
  const fullMessage = "Welcome to Mindcode! I'm Mindbot! Curious about us? Tap the link and explore ✨";

  const handleLinkClick = (e) => {
    e.preventDefault();
    props.onLinkClick(); 
  };

  useEffect(() => {
    let i = 0;
    let interval;
    let loop;
    let cursorInterval;

    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    const startTyping = () => {
      setMessage(""); 
      i = 0;

      interval = setInterval(() => {
        setMessage(fullMessage.slice(0, i++));
        if (i > fullMessage.length) {
          clearInterval(interval);
          clearInterval(cursorInterval);
          setShowCursor(false);
        }
      }, 45);
    };

    startTyping(); 

    loop = setInterval(() => {
      cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      startTyping();
    }, 8000);

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

  const renderMessage = () => {
    const parts = fullMessage.split("link");
    if (parts.length === 1) return (
      <>
        {message}
        {showCursor && <span className="cursor">|</span>}
      </>
    );
    
    const typedParts = message.split("link");
    
    return (
      <>
        {typedParts[0]}
        {message.includes("link") && (
          <a 
            href="/info" 
            onClick={handleLinkClick}
            className="text-purple-300 underline cursor-pointer hover:text-purple-100 transition-colors"
          >
            link
          </a>
        )}
        {typedParts[1]}
        {showCursor && message.length < fullMessage.length && (
          <span className="cursor">|</span>
        )}
      </>
    );
  };

  
  return (
    <group ref={group} {...props}>
      <primitive
        object={scene}
        scale={1.5}
        position={[0, -0.9, 0]}
        castShadow
        receiveShadow
      />
      <Html position={[ 2.3, 0.9, 0]} center distanceFactor={10}>
        <div className="relative w-[150px] min-h-[100px] px-5 py-4 rounded-2xl border border-purple-400 bg-gradient-to-br from-[#2d1f4d] to-[#3b0f78] text-white text-base font-medium shadow-xl animate-fade transition-all duration-500">
          <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-[#3b0f78]"></div>
          <p className="text-[8px] whitespace-pre-wrap leading-relaxed">
            {renderMessage()}
          </p>
        </div>
      </Html>
    </group>
  );
}

RobotModel.propTypes = {
  onLinkClick: PropTypes.func.isRequired
};