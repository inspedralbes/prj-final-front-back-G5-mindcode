'use client';

import React from 'react';

const FormButton = ({ text, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {text}
    </button>
  );
};

export default FormButton;
