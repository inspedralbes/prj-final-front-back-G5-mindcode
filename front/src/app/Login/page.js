"use client";

import React, { useState, useEffect, Suspense } from "react";
import { googleLogin } from "../../services/firebase";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAuthStore } from '../../stores/authStore';
import dynamic from "next/dynamic";
import Tilt from "react-parallax-tilt";

import LoginPanel from "../components/organisms/LoginPanel";

const RobotModel = dynamic(() => import("../components/RobotModel"), { ssr: false });

const Signup = () => {
  const [hydrated, setHydrated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { userData, photoURL } = await googleLogin();
      console.log('User data:', userData);
      if (!userData) return;



      setUserInfo({
        ...userData,
      });

      useAuthStore.setState((state) => ({
        user_info: {
          ...state.user_info, 
          photoURL,          
        },
      }));


      const userDataParsed = userData.userData;
      if (userDataParsed.teacher == 1) {
        router.push(userData.hasClass ? '/PfPage' : '/CreateClass');
      } else {
        router.push(userData.hasClass ? '/StPage' : '/JoinClass');
      }
    } catch (error) {
      console.error("Error per fer Login:", error);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800 text-white"></div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-visible relative p-4">
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={false}
        className="w-[90%] max-w-5xl overflow-visible"
      >
        <div className="relative flex flex-row bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
          <LoginPanel onLogin={handleGoogleLogin} />
          <div className="hidden lg:flex relative w-1/2 h-[500px] z-0 overflow-visible pr-14">
            <div className="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[700px] h-[500px] overflow-visible">
              <Canvas
                shadows
                camera={{ position: [0, 1, 5], fov: 50 }}
                style={{ overflow: "visible" }}
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[2, 2, 5]} intensity={1} castShadow />
                <Suspense fallback={null}>
                  <RobotModel />
                </Suspense>
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Signup;
