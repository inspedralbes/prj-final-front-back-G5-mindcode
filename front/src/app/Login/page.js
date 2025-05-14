"use client";
import { motion, AnimatePresence } from "framer-motion";

import React, { useState, useEffect, Suspense } from "react";
import { googleLogin } from "../../services/firebase";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAuthStore } from '../../stores/authStore';
import dynamic from "next/dynamic";
import Tilt from "react-parallax-tilt";
import LoginPanel from "../components/organisms/LoginPanel";
import LoadingScreen from "../components/LoadingScreen";

const RobotModel = dynamic(() => import("../components/RobotModel"), { ssr: false });

const Signup = () => {
  const [hydrated, setHydrated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showRobotDialog, setShowRobotDialog] = useState(false);
  const router = useRouter();

  const user = useAuthStore((state) => state.user_info);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLinkClick = () => {
    setIsFlipping(true);
    setTimeout(() => router.push("/info"), 1000);
  };

  const handleRobotClick = () => {
    setShowRobotDialog(true);
  };

  const closeDialog = () => {
    setShowRobotDialog(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { userData, photoURL } = await googleLogin();
      // console.log('User data:', userData);
      if (!userData) return;



      setUserInfo({
        ...userData,
        photoURL
      });

      console.log("checking ONLY quizzes:", userData.userData.class_info[0]?.quizz_info);

      useAuthStore.setState((state) => ({
        user_info: {
          ...state.user_info,
          photoURL,
        },
      }));

      console.log("USER BEING LOGGED IN", user);


      const userDataParsed = userData.userData;
      if (userDataParsed.teacher === 1) {
        router.push(userData.hasClass ? '/PfPage' : '/CreateClass');
      } else {
        router.push(userData.hasClass ? '/StPage' : '/JoinClass');
      }
    } catch (error) {
      console.error("Login error:", error);
    }finally{
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
        Loading...
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-visible relative p-4">
      {loading && <LoadingScreen />} 

      <div className={`relative w-[full] h-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
           style={{ transformOrigin: 'right center' }}>
        <Tilt
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          glareEnable={false}
          className="w-full max-w-5xl mx-auto flex justify-center"
        >
          <div className="w-[1000px] h-[600px] relative flex flex-row bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
            <div className="w-[500px] flex flex-col justify-center p-12">
              <h2 className="text-[23px] font-bold mb-2 text-purple-300">Autentiqueu-vos en Mindcode <span className="text-white">utilitzant el vostre compte a:</span></h2>
              
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-all duration-300 relative overflow-hidden group border border-purple-400/30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.166-2.698-6.735-2.698-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.065-1.285-0.182-1.891h-9.818z"/>
                </svg>
                Google / inspedralbes.cat
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>

              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
              </motion.div>
            </div>

            <div className="w-[500px] lg:w-/2 flex justify-center p-8">
              <div className="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[700px] h-[500px] overflow-visible">
                <Canvas
                  shadows
                  camera={{ position: [0, 1, 5], fov: 50 }}
                  style={{ overflow: "visible" }}
                >
                  <ambientLight intensity={0.3} />
                  <directionalLight position={[2, 2, 5]} intensity={1} castShadow />
                  <Suspense fallback={null}>
                    <RobotModel onRobotClick={handleRobotClick} />
                  </Suspense>
                  <OrbitControls enableZoom={false} />
                </Canvas>
              </div>
            </div>
          </div>
        </Tilt>
      </div>

     {showRobotDialog && (
  <motion.div 
    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.7, opacity: 0, y: 20 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 200
      }}
      className="relative w-[320px] min-h-[150px] px-6 py-5 rounded-2xl border-2 border-purple-300/30 bg-gradient-to-br from-[#1e103c] via-[#3b1a75] to-[#2d1f4d] text-white shadow-2xl"
    >
      <div className="absolute inset-0 rounded-xl border-t  border-l border-purple-200/10 border-b-0 border-r-0 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-xl border-b border-r border-purple-500/20 border-t-0 border-l-0 pointer-events-none"></div>
      
      <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
        boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.3)',
      }}></div>
      
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={closeDialog}
        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-300/50 shadow-lg transition-all duration-200 group"
      >
        <span className="text-white group-hover:text-purple-200 transition-colors">×</span>
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{
          background: 'radial-gradient(circle at center, rgba(216, 180, 254, 0.4) 0%, transparent 70%)'
        }}></div>
      </motion.button>
      
      <div className="relative z-10">
        <motion.div 
          animate={{
            y: [0, -5, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-purple-500/10 blur-xl"
        ></motion.div>
        <motion.div 
          animate={{
            y: [0, 5, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-purple-600/10 blur-xl"
        ></motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm leading-relaxed tracking-wide  font-medium" style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}
        >
          Welcome to Mindcode! Curious about us? Tap the link and explore ✨
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex justify-center"
        >
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/info" 
            onClick={(e) => {
              e.preventDefault();
              closeDialog();
              handleLinkClick();
            }}
            className="relative px-4 py-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
          >
            <span className="relative z-10"> MINDCODE 🪄</span>
            <div className="absolute inset-0 rounded-lg border-t border-purple-300/30 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: 'radial-gradient(circle at center, rgba(216, 180, 254, 0.4) 0%, transparent 70%)',
              boxShadow: '0 0 15px rgba(167, 139, 250, 0.6)'
            }}></div>
          </motion.a>
        </motion.div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: -100,
              opacity: [0, 1, 0],
              x: Math.random() > 0.5 ? 20 : -20
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute bg-purple-300/20 rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
)}

      <div className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
           style={{ transformOrigin: 'left center' }}></div>
    </div>
  );
};

export default Signup;