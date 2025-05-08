"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InfoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className={`relative min-h-screen bg-gray-900 text-white ${isMounted ? "opacity-100" : "opacity-0"}`}>
      <button
        onClick={handleBackClick}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 hover:bg-purple-700/70 transition-all duration-300 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Mindbot
      </button>

      <div className={`container mx-auto px-6 py-24 max-w-4xl transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
          Welcome to Mindcode
        </h1>
        <div className="w-[1000px] h-[610px] bg-white/10 p-10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">

         <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
              <h2 className="text-2xl font-semibold mb-3 text-cyan-200">Our Mission</h2>
              <p className="text-purple-100 leading-relaxed">
                {/* We're revolutionizing tech education through immersive AI experiences. 
                Mindcode bridges the gap between curiosity and expertise with our 
                interactive learning platform.
                We're revolutionizing tech education through immersive AI experiences. 
                Mindcode bridges the gap between curiosity and expertise with our 
                interactive learning platform. We're revolutionizing tech education through immersive AI experiences. 
                Mindcode bridges the gap between curiosity and expertise with our 
                interactive learning platform. */}
              </p>
              
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
              <h2 className="text-2xl font-semibold mb-3 text-cyan-200">Meet Mindbot</h2>
              <p className="text-purple-100 leading-relaxed">
                {/* Your AI guide uses advanced natural language processing to answer 
                questions, provide tutorials, and adapt to your learning style in 
                real-time. */}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
              <h2 className="text-2xl font-semibold mb-3 text-cyan-200">Features</h2>
              {/* <ul className="space-y-3 text-purple-100">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  Interactive coding environments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  Personalized learning paths
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  Real-time project feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  Community-powered knowledge
                </li>
              </ul> */}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01] overflow-visible">
              <h2 className="text-2xl font-semibold mb-3 text-cyan-200">Get Started</h2>
              {/* <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/30">
                Join Beta Program
              </button> */}
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
    </div>
  );
}