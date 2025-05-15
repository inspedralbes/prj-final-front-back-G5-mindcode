import React, { useEffect } from "react";

const Snackbar = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); 
        }, 3000);

        return () => clearTimeout(timer); 
    }, [onClose]);

    return (
        <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-xs w-full bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between opacity-100 transition-all duration-500 ease-in-out z-50"
        >
            <span className="text-sm">{message}</span>
            <button
                className="text-white ml-4"
                onClick={onClose}
            >
                ✘
            </button>
        </div>
    );
};

export default Snackbar;