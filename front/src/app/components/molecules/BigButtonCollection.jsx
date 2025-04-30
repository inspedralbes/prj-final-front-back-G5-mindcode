import React from 'react';
import LargeButton from '../atoms/LargeButton';

const BigButtonCollection = ({ buttons }) => {
    return (
        <div className="w-full h-full space-y-3 flex flex-col justify-center items-center">
            {buttons.map((button, index) => (
                <div key={index} className="mx-5">
                    <LargeButton button={button} />
                </div>
            ))}
        </div>
    );
};

export default BigButtonCollection;