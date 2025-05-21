import React from 'react';
import SmallButton from '../atoms/SmallButton';

const ButtonCollection = ({ buttons }) => {
    return (
        <div className="flex flex-wrap gap-2 justify-end">
            {buttons.map((button, index) => (
                <SmallButton 
                    key={index} 
                    onClick={button.onClick} 
                    label={button.label} 
                />
            ))}
        </div>
    );
};

export default ButtonCollection;