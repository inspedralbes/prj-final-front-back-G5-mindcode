import React from 'react';

const MediumButton = ({ onClick, label }) => {
    return (
        <button onClick={onClick}
            className="
    px-4 py-2 
    w-full mx-auto
    bg-blue-500 hover:bg-blue-600 
    dark:text-white font-medium rounded-lg
    transition-colors duration-200 ease-in-out
    shadow-md hover:shadow-lg
    active:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
">
            {label}
        </button>
    );
};

export default MediumButton;