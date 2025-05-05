"use client";

import React, { useState } from "react";
import styles from "../organisms/GameCirclePanel.module.css";
import Image from "next/image";

const icons = [
  { src: "/images/css.png", alt: "CSS" },
  { src: "/images/javascript.png", alt: "JavaScript" },
  { src: "/images/html.png", alt: "HTML" },
  { src: "/images/java.png", alt: "Java" },
  { src: "/images/python.png", alt: "Python" },
  { src: "/images/php.png", alt: "PHP" },
  { src: "/images/Sql.png", alt: "SQL" },



  { src: "/images/csharp.svg.png", alt: "Csharp" },

  { src: "/images/Sql.png", alt: "SQL" },
];

const GameCirclePanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const rotation = `rotate(${-activeIndex * (360 / icons.length)}deg)`;

  return (
    <div className={styles.gameBackground}>
      <div className={styles.cardsContainer}>
        <div className={styles.centerImage}>
          <Image
            id="mainImage"
            src={icons[activeIndex].src}
            alt="Principal"
            width={120}
            height={120}
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
                    width={60}
                    height={60}
                    className="hover:scale-110 transition-transform"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameCirclePanel;
