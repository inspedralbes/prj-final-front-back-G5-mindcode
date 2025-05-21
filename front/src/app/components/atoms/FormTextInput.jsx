"use client";

import React from "react";


const FormTextInput = ({ placeholder, text, handleOnChange }) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={handleOnChange}
            className="w-full max-w-xs p-2 border rounded-lg"
        />
    )
};

export default FormTextInput;