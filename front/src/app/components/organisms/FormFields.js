'use client';

import React from 'react';
import FormField from '../molecules/FormField';

const FormFields = ({ questions, answers, onAnswerChange, showResults }) => {
  if (showResults) {
    const totalQuestions = questions.length;
    const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Results</h2>
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Score: {correctAnswers} / {totalQuestions} ({percentage}%)
          </div>
        </div>

        {questions.map((question) => {
          const answer = answers[question.question_id];
          const isCorrect = answer?.isCorrect;

          return (
            <div
              key={question.question_id}
              className={`p-4 rounded-lg border ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="mb-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {question.question_text}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="space-y-1">
                    <div>La teva opció: {answer?.selected_text || question.options[answer?.selected_option]}</div>
                    {!isCorrect && (
                      <div className="text-red-600 dark:text-red-400">
                        Opció correcta: {question.options[question.correct_option]}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCorrect
                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                }`}>
                  {isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.question_id}>
          <FormField
            question={{
              text: question.question_text,
              type: question.question_type,
              options: question.options || []
            }}
            value={answers[question.question_id]}
            onChange={(answer) => onAnswerChange(question.question_id, answer)}
            required={true}
            questionId={question.question_id}
          />
        </div>
      ))}
    </div>
  );
};

export default FormFields;
