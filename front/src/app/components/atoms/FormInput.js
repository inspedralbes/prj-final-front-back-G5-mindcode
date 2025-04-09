'use client';

import React from 'react';

const FormInput = ({ question, options = [], value, onChange, required = false, className = '' }) => {
  console.log('FormInput received:', { question, options, value });

  if (!options || options.length === 0) {
    return (
      <div className="mb-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {question}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="space-y-3">
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <input
              type="radio"
              name={question}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FormInput;
