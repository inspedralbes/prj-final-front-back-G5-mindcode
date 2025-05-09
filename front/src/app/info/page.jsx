"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const containerRef = useRef();

  const features = [
    {
      id: "ai-mentors",
      title: "🧠 AI Language Mentors",
      description: "Specialized chatbots for each programming language that guide students with contextual help",
      color: "from-purple-600 to-indigo-600"
    },
    {
      id: "smart-quizzes",
      title: "📝 Smart Weekly Quizzes",
      description: "Personalized quizzes generated from your questions to reinforce learning",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "game-mode",
      title: "🎮 Game-Based Learning",
      description: "Interactive coding games that make learning fun and rewarding",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: "teacher-dash",
      title: "📊 Teacher Dashboard",
      description: "Real-time analytics on student progress and quiz performance",
      color: "from-amber-500 to-orange-600"
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleBackClick = () => {
    setIsFlipping(true);
    setTimeout(() => router.push("/"), 1000);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <div ref={containerRef} className={`relative w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} style={{ transformOrigin: 'left center' }}>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackClick} 
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 hover:bg-purple-700/70 transition-all duration-300 group shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
          Back to Mindbot
        </motion.button>

        <div className={`container mx-auto px-6 py-24 max-w-6xl transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 animate-gradient">
              Welcome to Mindcode Universe!
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Where programming education meets AI-powered interactive experiences
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_0] hover:shadow-purple-500/30`}
                >
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {!activeFeature && (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">👆</div>
                      <h3 className="text-2xl font-bold text-cyan-200 mb-2">Explore Our Features</h3>
                      <p className="text-purple-200">Click on any feature to see it in action!</p>
                    </div>
                  </motion.div>
                )}
                
                {activeFeature === "ai-mentors" && (
                  <motion.div
                    key="ai-mentors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-indigo-900/70 rounded-2xl p-8 flex flex-col"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">AI Language Mentors</h3>
                    <div className="flex-1 bg-gray-900/50 rounded-xl p-4 mb-4 overflow-auto">
                      <div className="chat chat-start">
                        <div className="chat-bubble bg-indigo-700">Hi! I'm your CSS mentor. What would you like to learn today?</div>
                      </div>
                      <div className="chat chat-end">
                        <div className="chat-bubble bg-purple-700">How do I center a div?</div>
                      </div>
                      <div className="chat chat-start">
                        <div className="chat-bubble bg-indigo-700">Great question! You can use:<br/>1. margin: auto<br/>2. text-align: center<br/>3. flexbox with justify-content: center</div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-sm">
                      <p>Each language has its own specialized AI that only answers questions about that specific technology</p>
                    </div>
                  </motion.div>
                )}
                
                {activeFeature === "smart-quizzes" && (
                  <motion.div
                    key="smart-quizzes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-900/70 to-blue-900/70 rounded-2xl p-8 flex flex-col"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Smart Weekly Quizzes</h3>
                    <div className="flex-1 bg-gray-900/50 rounded-xl p-6 mb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Based on your CSS questions this week:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input type="radio" name="quiz" className="radio radio-sm" />
                              <label>What property centers a div horizontally?</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="radio" name="quiz" className="radio radio-sm" />
                              <label>How do you create a flex container?</label>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-700">
                          <button className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-medium">Submit Quiz</button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-sm">
                      <p>Weekly quizzes generated from your questions to reinforce learning</p>
                    </div>
                  </motion.div>
                )}
                
              </AnimatePresence>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300">
              Game-Based Learning Adventures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Code Quest",
                  desc: "Solve puzzles by writing correct code",
                  icon: "🕹️"
                },
                {
                  title: "Bug Hunter",
                  desc: "Find and fix errors in programs",
                  icon: "🐞"
                },
                {
                  title: "Syntax Race",
                  desc: "Type code faster than opponents",
                  icon: "🏎️"
                }
              ].map((game, index) => (
                <motion.div
                  key={game.title}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg"
                >
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-gray-300">{game.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-amber-300">Teacher Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { value: "85%", label: "Class Average" },
                { value: "24", label: "Active Students" },
                { value: "92%", label: "Completion Rate" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700"
                >
                  <div className="text-3xl font-bold text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4 h-64 flex items-center justify-center">
              <p className="text-gray-400">Visualization of student progress would appear here</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fixed top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/3 left-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

      <div 
        className={`fixed inset-0 bg-gray-900 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
        style={{ transformOrigin: 'right center' }}
      ></div>
    </div>
  );
}