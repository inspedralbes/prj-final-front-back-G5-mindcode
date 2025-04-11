'use client';

import React from 'react';
import QuizTemplate from '../templates/QuizTemplate';

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Programming Quiz
        </h1>
        <QuizTemplate />
      </div>
    </div>
  );
};

export default QuizPage;
