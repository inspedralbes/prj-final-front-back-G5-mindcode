'use client';

import React from 'react';
import FormInput from '../atoms/FormInput';

const FormField = ({ question, value, onChange, required = true, questionId }) => {
  return (
    <FormInput
      question={question.text}
      type={question.type || 'MCQ'}
      options={question.options}
      value={value}
      onChange={onChange}
      required={required}
      question_id={questionId}
    />
  );
};

export default FormField;
