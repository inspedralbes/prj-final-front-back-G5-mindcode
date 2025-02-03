CREATE TABLE IF NOT EXISTS CLASS (
    idclass INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255),
    name VARCHAR(255),
    teacher_id TEXT,
    language TEXT
);

CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    gmail VARCHAR(255),
    teacher BOOLEAN,
    language TEXT,
    googleId TEXT,
    class INT,
    FOREIGN KEY (class) REFERENCES CLASS (idclass)
);

CREATE TABLE IF NOT EXISTS LANGUAGE (
    idlanguage INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    system_prompt LONGTEXT
);

CREATE TABLE IF NOT EXISTS SUBLANGUAGE (
    id INT AUTO_INCREMENT,
    idlanguage INT,
    name VARCHAR(255),
    system_prompt LONGTEXT,
    PRIMARY KEY (id, idlanguage),
    FOREIGN KEY (idlanguage) REFERENCES LANGUAGE(idlanguage)
);

CREATE TABLE IF NOT EXISTS RESTRICTION (
    idrestriction INT AUTO_INCREMENT PRIMARY KEY,
    nivell ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    content TEXT
);