'use client';

import React from 'react';
import FormInput from '../atoms/FormInput';

const FormField = ({ question, value, onChange }) => {
  return (
    <FormInput
      question={question.text}
      options={question.options}
      value={value}
      onChange={onChange}
      required={true}
    />
  );
};

export default FormField;
