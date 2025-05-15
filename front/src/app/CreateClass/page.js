"use client";

import React, {useState} from "react";
import Tilt from "react-parallax-tilt";
import JoinClassForm from "../components/organisms/JoinClassForm";
import LoadingScreen from "app/components/LoadingScreen";
import CreateClassForm from "../components/organisms/CreateClassForm";

const CreateClass = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-visible relative p-10">
      {loading && <LoadingScreen />} 
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={false}
        className="w-[100%] max-w-6xl overflow-visible"
      >
        <div className="relative flex flex-row bg-gray-800 p-10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
          <CreateClassForm />
          <JoinClassForm setLoad={setLoading} />
        </div>
      </Tilt>
    </div>
  );
};

export default CreateClass;
