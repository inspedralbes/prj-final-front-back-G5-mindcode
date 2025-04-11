'use client';

import React from 'react';
import FormInput from '../atoms/FormInput';

const FormField = ({ question, value, onChange, required = true }) => {
  const handleOptionChange = (selectedOption, selectedIndex) => {
    onChange({
      value: selectedOption,
      optionIndex: selectedIndex
    });
  };

  return (
    <FormInput
      question={question.text}
      options={question.options}
      value={value?.value || ''}
      onChange={handleOptionChange}
      required={required}
    />
  );
};

export default FormField;
