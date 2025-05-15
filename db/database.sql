-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Temps de generació: 22-01-2025 a les 12:17:40
-- Versió del servidor: 10.4.32-MariaDB
-- Versió de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `mindcode`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `class`
--

CREATE TABLE `class` (
  `idclass` int(11) NOT NULL,
   `code` VARCHAR(255),  NOT NULL, 
  `name` varchar(255) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `language` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `class`
--

INSERT INTO `class` (`idclass`,`code`, `name`, `teacher_id`, `language`) VALUES
(1, 'PY101','Introduction to Python', 1, 'Python'),
(2,  'JS201','JavaScript for Web Development', 2, 'JavaScript'),
(3, 'JAVA301','Advanced Java Concepts', 2, 'Java');

-- --------------------------------------------------------

--
-- Estructura de la taula `languages`
--

CREATE TABLE `languages` (
  `idlanguage` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `system_prompt` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `languages`
--
INSERT INTO `languages` (`idlanguage`, `name`, `system_prompt`) VALUES
(1, 'Python', 'Default prompt for Python programming'),
(2, 'JavaScript', 'Default prompt for JavaScript programming'),
(3, 'Java', 'Default prompt for Java programming');


-- --------------------------------------------------------

--
-- Estructura de la taula `restriction`
--

CREATE TABLE `restriction` (
  `idrestriction` int(11) NOT NULL,
  `nivell` enum('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `restriction`
--

INSERT INTO `restriction` (`idrestriction`, `nivell`, `content`) VALUES
(1, 'BEGINNER', 'Basics of programming, suitable for beginners'),
(2, 'INTERMEDIATE', 'Intermediate concepts in programming'),
(3, 'ADVANCED', 'Advanced programming techniques');

-- --------------------------------------------------------

--
-- Estructura de la taula `sublanguages`
--

CREATE TABLE `sublanguages` (
  `id` int(11) NOT NULL,
  `idlanguage` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `system_prompt` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `sublanguages`
--

INSERT INTO `sublanguages` (`id`, `idlanguage`, `name`, `system_prompt`) VALUES
(1, 1, 'Flask', 'Prompt for Flask framework in Python'),
(2, 1, 'Django', 'Prompt for Django framework in Python'),
(3, 2, 'React', 'Prompt for React library in JavaScript'),
(4, 2, 'Node.js', 'Prompt for Node.js runtime in JavaScript'),
(5, 3, 'Spring', 'Prompt for Spring framework in Java'),
(6, 3, 'Hibernate', 'Prompt for Hibernate ORM in Java');

-- --------------------------------------------------------

--
-- Estructura de la taula `users`
--

CREATE TABLE `users` (
  `iduser` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gmail` varchar(255) DEFAULT NULL,
  `teacher` tinyint(1) DEFAULT NULL,
  `language` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `users`
--

INSERT INTO `users` (`iduser`, `name`, `gmail`, `teacher`, `language`) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', 1, 'Python'),
(2, 'Bob Smith', 'bob.smith@gmail.com', 1, 'JavaScript'),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', 0, 'Java'),
(4, 'Diana Lee', 'diana.lee@gmail.com', 0, 'Python');

--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`idclass`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Índexs per a la taula `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`idlanguage`);

--
-- Índexs per a la taula `restriction`
--
ALTER TABLE `restriction`
  ADD PRIMARY KEY (`idrestriction`);

--
-- Índexs per a la taula `sublanguages`
--
ALTER TABLE `sublanguages`
  ADD PRIMARY KEY (`id`,`idlanguage`),
  ADD KEY `idlanguage` (`idlanguage`);

--
-- Índexs per a la taula `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`iduser`);

--
-- AUTO_INCREMENT per les taules bolcades
--

--
-- AUTO_INCREMENT per la taula `class`
--
ALTER TABLE `class`
  MODIFY `idclass` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la taula `languages`
--
ALTER TABLE `languages`
  MODIFY `idlanguage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la taula `restriction`
--
ALTER TABLE `restriction`
  MODIFY `idrestriction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la taula `sublanguages`
--
ALTER TABLE `sublanguages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la taula `users`
--
ALTER TABLE `users`
  MODIFY `iduser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restriccions per a les taules bolcades
--

--
-- Restriccions per a la taula `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`iduser`);

--
-- Restriccions per a la taula `sublanguages`
--
ALTER TABLE `sublanguages`
  ADD CONSTRAINT `sublanguages_ibfk_1` FOREIGN KEY (`idlanguage`) REFERENCES `languages` (`idlanguage`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
