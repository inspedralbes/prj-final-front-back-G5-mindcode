import React from 'react';

const SubtitleCard = ({ children }) => {
  return (
    <div className="container mx-auto flex justify-between items-center py-2">
        <div className="text-xl text-gray-100">{children}</div>
    </div>
  );
};

export default SubtitleCard;
