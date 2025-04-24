'use client';

import React from 'react';

const QuizResults = ({ results, questions }) => {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Results</h2>
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Score: {correctAnswers} / {totalQuestions} ({percentage}%)
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result) => {
          const question = questions.find(q => q.question_id === result.question_id);
          return (
            <div 
              key={result.question_id}
              className={`p-4 rounded-lg border ${
                result.isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="mb-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {question?.question_text}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {result.question_type === 'MCQ' ? (
                    <div className="space-y-1">
                      <div>Your answer: Option {result.selected_option + 1}</div>
                      {!result.isCorrect && (
                        <div className="text-red-600 dark:text-red-400">
                          Correct answer: Option {result.correct_option + 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div>Your answer: {result.value}</div>
                      {question?.correct_answer && (
                        <div className="text-gray-600 dark:text-gray-400">
                          Expected answer: {question.correct_answer}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.isCorrect
                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                }`}>
                  {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResults;
