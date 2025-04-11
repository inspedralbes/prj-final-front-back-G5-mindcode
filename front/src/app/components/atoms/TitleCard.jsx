import React from 'react';

const TitleCard = ({ children }) => {
  return (
    <div className="container mx-auto flex justify-between items-center px-4 py-3 flex-col">
        <div className="text-3xl font-bold">{children}</div>
    </div>
  );
};

export default TitleCard;