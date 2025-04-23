import React from 'react';

const ImageContainer = ({ src, alt = '' }) => {
  return (
    <div className="inline-block overflow-hidden cursor-pointer">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={() => window.open(src, '_blank')}
      />
    </div>
  );
};

export default ImageContainer;