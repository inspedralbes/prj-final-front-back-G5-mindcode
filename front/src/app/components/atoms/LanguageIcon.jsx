import React from 'react';

const LanguageIcon = ({ src, alt }) => (
  <label>
    <img src={src} alt={alt} className="w-10 h-10 object-contain hover:scale-110 transition-transform" />
  </label>
);

export default LanguageIcon;
