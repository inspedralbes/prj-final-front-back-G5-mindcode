INSERT INTO CLASS (idclass, code, name, teacher_id, language) VALUES
(1, 'PY101', 'Introduction to Python', '[1]', '["Python"]'),
(2, 'JS201', 'JavaScript for Web Development', '[2]', '["Javascript"]'),
(3, 'JAVA301', 'Advanced Java Concepts', '[2]', '["PHP"]');

INSERT INTO USER (id, name, gmail, teacher, language, googleId, class) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', TRUE, '["Python"]', NULL, 1),
(2, 'Bob Smith', 'bob.smith@gmail.com', TRUE, '["Javascript"]', NULL, 2),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', FALSE, '["Java"]', NULL, 3),
(4, 'Diana Lee', 'diana.lee@gmail.com', FALSE, '["Python"]', NULL, NULL);

INSERT INTO LANGUAGE (idlanguage, name, system_prompt) VALUES
(1, 'Python', 'General system prompt for Python'),
(2, 'JavaScript', 'General system prompt for JavaScript'),
(3, 'Java', 'General system prompt for Java');

INSERT INTO SUBLANGUAGE (id, idlanguage, name, system_prompt) VALUES
(1, 1, 'Flask', 'Prompt for Flask framework in Python'),
(2, 1, 'Django', 'Prompt for Django framework in Python'),
(3, 2, 'React', 'Prompt for React library in JavaScript'),
(4, 2, 'Node.js', 'Prompt for Node.js runtime in JavaScript'),
(5, 3, 'Spring', 'Prompt for Spring framework in Java'),
(6, 3, 'Hibernate', 'Prompt for Hibernate ORM in Java');

INSERT INTO RESTRICTION (idrestriction, nivell, content) VALUES
(1, 'BEGINNER', 'Basics of programming, suitable for beginners'),
(2, 'INTERMEDIATE', 'Intermediate concepts in programming'),
(3, 'ADVANCED', 'Advanced programming techniques');