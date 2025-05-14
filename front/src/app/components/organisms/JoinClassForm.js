"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { joinClass } from "../../../services/communicationManager";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';

const JoinClassForm = ({setLoading}) => {
  const router = useRouter();
  const [classCode, setClassCode] = useState("");
  const userInfo = useAuthStore((state) => state.user_info);

  const handleJoin = async () => {
    if (classCode) {
      setLoading(true);
      try {
        const response = await joinClass(classCode);
        if (response.class_info) {
          router.push(response.isTeacher? '/PfPage' : '/StPage');
        } else {
          alert("Failed to join class. Please check your details.");
        }
      } catch (error) {
        console.error("Error joining class:", error);
        alert("An error occurred while joining the class.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter the class code.");
    }
  };

  return (
    <div className="min-h-[100px] bg-gray-900  ml-[219px] flex items-center justify-center p-10 relative overflow-hidden">
            <div className=" absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.6, 0.3],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }
            }}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-[full] max-w-md bg-gray-800/50  backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 shadow-xl relative"
      >
        <div className="absolute inset-0 rounded-xl border-t border-l border-purple-400/10 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-xl border-b border-r border-purple-500/20 pointer-events-none"></div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Uneix-te a una classe existent
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-purple-200 mb-2">Codi de la classe</label>
          <input
            type="text"
            placeholder="Introdueix el codi"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-purple-500/30 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-300/50 transition-all"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            Unir-me a la classe
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinClassForm;