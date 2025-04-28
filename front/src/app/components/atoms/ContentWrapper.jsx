import React from 'react';

const ContentWrapper = ({ children, bgColor = "bg-white", darkBgColor = "dark:bg-gray-800" }) => {
    return (
        <div className={`p-8 rounded-lg ${bgColor} ${darkBgColor} dark:bg-gray-800 shadow-md`}>
            {children}
        </div>
    );
};

export default ContentWrapper;