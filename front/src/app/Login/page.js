"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { googleLogin } from '../../services/firebase';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import Tilt from 'react-parallax-tilt';

const RobotModel = dynamic(() => import('../components/RobotModel'), { ssr: false });

const Signup = () => {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const userData = await googleLogin();
      if (!userData) return;

      const userDataParsed = userData.userData;
      if (userDataParsed.teacher == 1) {
        router.push(userData.hasClass ? '/PfPage' : '/CreateClass');
      } else {
        router.push(userData.hasClass ? '/StPage' : '/JoinClass');
      }
    } catch (error) {
      console.error('Login error:', error);
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

          <div className="w-full lg:w-1/2 h-[500px] p-10 flex items-center justify-center z-10">
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.15}
              className="w-full max-w-md"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01]">
                <h5 className="text-1xl font-bold mb-6 text-center">Autentiqueu-vos utilitzant el vostre compte a:
                </h5>
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white text-black font-semibold py-3 w-full rounded-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3">
                    <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                    <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                    <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                    <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                  </svg>
                  Google / @inspedralbes.cat
                </button>
              </div>
            </Tilt>
          </div>

          <div className="hidden lg:flex relative w-1/2 h-[500px] z-0 overflow-visible">
            <div className="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[700px] h-[500px] overflow-visible">
              <Canvas
                shadows
                camera={{ position: [0, 1, 5], fov: 50 }}
                style={{ overflow: 'visible' }}
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
