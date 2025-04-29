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
  const [rotation3D, setRotation3D] = useState({ x: 0, y: 0 });

  const handleClick = (index) => setActiveIndex(index);

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rotateX = (e.clientY - centerY) * 0.01;
    const rotateY = (e.clientX - centerX) * -0.01;
    setRotation3D({ x: rotateX, y: rotateY });
  };

  const rotation = `rotateZ(${-activeIndex * (360 / icons.length)}deg)`;

  return (
    <div
      className={styles.cardsContainer}
      onMouseMove={handleMouseMove}
    >
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
          style={{
            "--items": icons.length,
            transform: `${rotation} rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg)`,
          }}
        >
          {icons.map((icon, index) => (
            <li key={index} style={{ "--i": index }}>
              <label onClick={() => handleClick(index)}>
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={40}
                  height={40}
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
