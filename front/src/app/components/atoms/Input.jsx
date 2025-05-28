import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = ""
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full mb-4 p-3 rounded-lg bg-white text-black focus:outline-none ${className}`}
    />
  );
};

export default Input;
