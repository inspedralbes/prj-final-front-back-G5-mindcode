"use client";

import React, { useState } from "react";
import styles from "../organisms/GameCirclePanel.module.css";
import Image from "next/image";

const icons = [
  { src: "/images/Csharp.png", alt: "Csharp" },
  { src: "/images/css.png", alt: "CSS" },
  { src: "/images/html.png", alt: "HTML" },
  { src: "/images/java.png", alt: "Java" },
  { src: "/images/javascript.png", alt: "JavaScript" },
  { src: "/images/php.png", alt: "PHP" },
  { src: "/images/python.png", alt: "Python" },
  { src: "/images/Sql.png", alt: "SQL" },
];

const LanguageCircle = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index);
    setSelectedLanguage(icons[index]); // set detail view
  };

  const handleBack = () => {
    setSelectedLanguage(null); // back to circle
  };

  const rotation = `rotate(${-activeIndex * (360 / icons.length)}deg)`;

  // 🔁 Detail view
  if (selectedLanguage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-sky-200 to-cyan-300 text-center">
        <Image
          src={selectedLanguage.src}
          alt={selectedLanguage.alt}
          width={120}
          height={120}
        />
        <h1 className="text-xl font-bold">{selectedLanguage.alt}</h1>
        <button
          onClick={handleBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          ⬅️ Tornar
        </button>
      </div>
    );
  }

  // 🌀 Spinner view
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.centerImage}>
        <Image
          id="mainImage"
          src={icons[activeIndex].src}
          alt="Principal"
          width={150}
          height={150}
        />
      </div>

      <div className={styles.circleWrapper}>
        <ul
          className={styles.cards}
          style={{ "--items": icons.length, transform: rotation }}
        >
          {icons.map((icon, index) => (
            <li key={index} style={{ "--i": index }}>
              <label onClick={() => handleClick(index)}>
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={64}
                  height={64}
                  className="hover:scale-110 transition-transform"
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageCircle;
