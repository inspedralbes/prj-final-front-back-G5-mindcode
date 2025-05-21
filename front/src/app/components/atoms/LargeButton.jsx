import React from 'react';

const LargeButton = ({ button }) => {
    return (
        <button
            className={`
                w-full
                py-3 px-4
                text-white font-bold 
                rounded-lg
                border-2
                ${button.bgColorClass || 'bg-red-600'}
                ${button.borderColorClass || 'border-red-700'}
            `}
            onClick={button.onClick}
        >
            {button.text}
        </button>
    );
};
export default LargeButton;