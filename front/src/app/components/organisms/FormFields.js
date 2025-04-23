'use client';

import React from 'react';
import FormField from '../molecules/FormField';

const FormFields = ({ questions, answers, onAnswerChange, showResults }) => {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.question_id} className="relative">
          <FormField
            question={{
              text: question.question_text,
              type: question.question_type,
              options: question.options || []
            }}
            value={answers[question.question_id]}
            onChange={(answer) => onAnswerChange(question.question_id, answer)}
            required={question.required}
          />
          {showResults && answers[question.question_id] && (
            <div className="mt-2 text-sm">
              <span className={`font-medium ${
                answers[question.question_id].optionIndex === question.correct_option ? 
                'text-green-600 dark:text-green-400' : 
                'text-red-600 dark:text-red-400'
              }`}>
                {answers[question.question_id].optionIndex === question.correct_option ? 
                  '✓ Correct answer' : 
                  `✗ The correct answer was: ${question.options[question.correct_option]}`
                }
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormFields;
