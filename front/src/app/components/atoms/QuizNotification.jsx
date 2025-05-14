'use client'
import React, { useEffect } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const QuizNotification = ({ onClick }) => {
  return (
    <div 
      className="fixed bottom-4 right-4 bg-yellow-400 text-black p-3 rounded-full shadow-lg cursor-pointer hover:bg-yellow-500 transition-colors"
      onClick={onClick}
      title="Quiz Available"
    >
      <FaExclamationCircle className="text-2xl animate-bounce" />
    </div>
  );
};

export default QuizNotification;


