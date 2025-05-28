"use client";

import React from "react";
import Button from "../atoms/Button";
import { motion, AnimatePresence } from "framer-motion";

const LanguageList = ({ languages, onLanguageClick, isOpen, toggleOpen }) => {
  return (
    <div className="space-y-2">
      <Button
        onClick={toggleOpen}
        className={`p-4 w-full text-left flex items-center gap-2 rounded-lg font-medium transition-all ${
          isOpen 
            ? 'bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white shadow-lg'
            : 'bg-gradient-to-r from-cyan-900 to-fuchsia-900 hover:from-cyan-700 hover:to-fuchsia-700 text-white'
        }`}
      >
        📄 Llenguatges
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="ml-auto transition-transform"
        >
          ▼
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 mt-2 space-y-2 overflow-hidden"
          >
            {languages.length > 0 ? (
              languages.map((language) => (
                <motion.div
                  key={language.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={() => onLanguageClick(language)}
                    className="w-full text-left px-4 py-2 rounded-lg font-medium transition-all
                      bg-gradient-to-r from-purple-500/20 to-purple-600/20 dark:from-purple-500/30 dark:to-purple-600/30
                      hover:from-blue-500/40 hover:to-purple-600/40 dark:hover:from-purple-500/50 dark:hover:to-blue-600/50
                      text-purple-800 dark:text-purple-200 border border-purple-300/50 dark:border-purple-500/30
                      hover:shadow-md hover:shadow-purple-500/20"
                  >
                    {language.name}
                  </Button>
                </motion.div>
              ))
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-purple-500/70 dark:text-purple-300/70 pl-3 py-2"
              >
                No hi ha llenguatges
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageList;  