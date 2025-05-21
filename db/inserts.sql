INSERT INTO CLASS (idclass, code, name, teacher_id, language) VALUES
(1, 'PY101', 'Introduction to Python', '[1]', '[{"id": 1,"name": "Python","restrictionId": 1,"isActive":true}]'),
(2, 'JS201', 'JavaScript for Web Development', '[2]', '[{"id":2,"name":"Javascript","restrictionId":3,"isActive":true},{"id":1,"name":"Python","restrictionId":1,"isActive":true}]'),
(3, 'JAVA301', 'Advanced Java Concepts', '[2]', '[{"id": 3,"name": "Java","restrictionId": 2,"isActive":true}]');

INSERT INTO USER (id, name, gmail, teacher, language, googleId, class) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', TRUE, '[{"id": 1,"name": "Python","restrictionId": 1,"isActive":true}]', NULL, 1),
(2, 'Bob Smith', 'bob.smith@gmail.com', TRUE, '[{"id":2,"name":"Javascript","restrictionId":3,"isActive":true},{"id":1,"name":"Python","restrictionId":1,"isActive":true}]', NULL, 2),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', FALSE, '[{"id": 2,"name": "Javascript","restrictionId": 3,"isActive":true}]', NULL, 3),
(4, 'Diana Lee', 'diana.lee@gmail.com', FALSE, '[{"id": 3,"name": "Java","restrictionId": 2}]', NULL, NULL);

INSERT INTO LANGUAGE (id, name) VALUES
(1, 'Python'),
(2, 'JavaScript'),
(3, 'Java');

INSERT INTO RESTRICTION (content) VALUES
("Only answer questions by explaining, don't provide code"),
("Answer questions by providing code snippets but not direct answers to the problem"),
("Answer questions by providing full code examples");