"use client";

import React,{useState} from "react";
import Tilt from "react-parallax-tilt";
import JoinClassForm from "../components/organisms/JoinClassForm";
import Title from "app/components/atoms/Title";
import LoadingScreen from "app/components/LoadingScreen";

const JoinClass = () => {
  const [loading, setLoading] = useState(false); 

  return (
    <div className="min-h-screen bg-gray-900  text-white flex items-center justify-center overflow-visible relative p-4">
      {loading && <LoadingScreen />} 
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={false}
        className="w-[90%] max-w-5xl overflow-visible"
      >
        <div className="relative flex flex-row  bg-gray-800 backdrop-blur-xl p-[60px] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
          <JoinClassForm setLoad={setLoading}/>
        </div>
      </Tilt>
    </div>
  );
};

export default JoinClass;
