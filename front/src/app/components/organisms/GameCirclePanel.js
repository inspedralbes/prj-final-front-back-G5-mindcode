"use client";

import React, { useState } from "react";
import styles from "../organisms/GameCirclePanel.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const languageRoutes = {
  css: { src: "/images/css.png", route: "/Lenguajes/css" },
  javascript: { src: "/images/javascript.png", route: "/Lenguajes/javascript" },
  html: { src: "/images/html.png", route: "/Lenguajes/html" },
  java: { src: "/images/java.png", route: "/Lenguajes/java" },
  python: { src: "/images/python.png", route: "/Lenguajes/python" },
  php: { src: "/images/php.png", route: "/Lenguajes/php" },
  sql: { src: "/images/Sql.png", route: "/Lenguajes/sql" },
  csharp: { src: "/images/csharp.svg.png", route: "/Lenguajes/csharp" },
};

const GameCirclePanel = ({ languages }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const icons = languages
    .map((lang) => {
      const key = lang.name.toLowerCase();
      if (languageRoutes[key]) {
        return {
          src: languageRoutes[key].src,
          alt: lang.name,
          route: languageRoutes[key].route,
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleClick = (index) => {
    setActiveIndex(index);
    router.push(icons[index].route); 
  };

  const rotation = `rotate(${-activeIndex * (360 / icons.length)}deg)`;

  if (icons.length === 0) {
    return (
      <div className="text-gray-500 text-xl text-center">
        No tens cap llenguatge assignat encara. Parla amb el teu professor.
      </div>
    );
  }

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


// ocultar respuestas
// quitar el cronometro
// si se golpea el el pared , el serpiente pierde cola y empieza desde el principio 
