'use client';

import React from 'react';

const FormInput = ({ question, question_id, type = 'MCQ', options = [], value, onChange, required = false, className = '' }) => {
  const handleChange = (type === 'MCQ') 
    ? (option, index) => {
        onChange({
          answer: option,
          question_id: question_id,
          question_text: question,
          selected_option: index
        });
      }
    : (textValue) => {
        onChange({
          answer: textValue,
          question_id: question_id, 
          question_text: question,
          selected_option: null
        });
      };

  return (
    <div className="mb-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      {type === 'MCQ' && options && options.length > 0 ? (
        <div className="space-y-2">
          {options.map((option, index) => (
          <label key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
            <input
              type="radio"
              name={`question_${question_id}`} 
              value={index}
              checked={value?.selected_option === index}
              onChange={() => handleChange(option, index)}
              required={required}
              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600"
            />
            <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ))}
        </div>
      ) : (
        <input
          type="text"
          value={value?.answer || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={required}
          className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
      )}
    </div>
  );
};

export default FormInput;