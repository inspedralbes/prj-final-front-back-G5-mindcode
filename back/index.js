import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import ShortUniqueId from 'short-unique-id';
import admin from 'firebase-admin';
import fs from 'fs';
import cors from 'cors';
import { login, verifyTokenMiddleware } from './tokens.js';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { log } from 'console';

dotenv.config();

const serviceaccount = JSON.parse(
    fs.readFileSync("./serviceaccount.json", "utf-8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
});

// Create an Express application
const app = express();
app.use(cors('*'));
const port = process.env.PORT;

// Parse JSON bodies for this app
app.use(express.json());

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const AIHOST = process.env.AIHOST;

// Unique ID generator used in class code generation
const uid = new ShortUniqueId({ length: 10 });

async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connection successful');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}



async function testConnection() {
    const connection = await createConnection();
    try {
        await connection.ping();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Database connection test failed:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

testConnection();

// login/register with google
app.post('/api/auth/google', async (req, res) => {
    const { uid, name, gmail } = req.body;

    if (!gmail.endsWith('@inspedralbes.cat')) {
        return res.status(400).json({ error: 'Incorrect Credentials' });
    }

    const ltterLtter = /^[a-zA-Z]{2}/;


    let teacher = 0;

    if (ltterLtter.test(gmail)) {
        teacher = 1;
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            "SELECT * FROM USER WHERE googleId = ?",
            [uid]
        );

        let userId;
        let classId = null;
        let class_info = [];


        if (rows.length === 0) { // user doesn't exist
            const [result] = await connection.execute(
                "INSERT INTO USER (googleId, name, gmail, teacher) VALUES (?, ?, ?, ?)",
                [uid, name, gmail, teacher]
            );
            userId = result.insertId;

            console.log("New user created in the database");
        } else { // user exists
            console.log("User already exists in the database");

            userId = rows[0].id;
            classId = rows[0].class;
            teacher = rows[0].teacher;

            if (teacher === 1) { // teacher
                class_info = await getClassesInfoWithTeacher(userId);
            } else { // student
                if (classId) {
                    class_info.push(await getClassInfo(classId));
                }
            }
        }

        await connection.end();
        const user = { id: userId };
        const token = login(user, process.env.SECRET_KEY)

        res.json({
            message: "User authenticated correctly",
            token,
            id: userId,
            name,
            gmail,
            teacher,
            class_id: class_info ? class_info.class_id : null,
            class_info: class_info
        });
    } catch (error) {
        console.error("Authenticated failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// create a class
app.post('/api/class', verifyTokenMiddleware, async (req, res) => {
    const { name } = req.body;
    const verified_user_id = req.verified_user_id;

    const language = "[]"; /* TODO: Add language array to class creation */

    if (!name || !verified_user_id) {
        return res.status(400).json({ error: 'Class name and teacher ID are required' });
    }


    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM USER WHERE id = ? AND teacher = "1"',
            [verified_user_id]
        );
        await connection.end();


        if (rows.length === 0) {
            return res.status(401).json({ error: 'You are not authorized to take that action' });
        }
    } catch (error) {
        console.error('Error verifying teacher ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    const class_code = uid.rnd();


    console.log(class_code);


    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO CLASS (name, teacher_id, language, code) VALUES (?, ?, ?, ?)',
            [name, JSON.stringify([verified_user_id]), language, class_code]
        );
        await connection.end();

        const class_info = await getClassesInfoWithTeacher(verified_user_id);
        res.status(201).json(class_info);
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// enroll into a class
app.post('/api/class/enroll', verifyTokenMiddleware, async (req, res) => {
    const { class_code } = req.body;
    const verified_user_id = req.verified_user_id

    if (!class_code) {
        return res
            .status(400)
            .json({ error: "Class code is required" });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT idclass FROM CLASS WHERE code = ?',
            [class_code]
        );
        await connection.end();


        if (rows.length === 0) {
            return res.status(400).json({ error: 'Class does not exist' });
        } else {
            const class_id = rows[0].idclass;
            // const teacher_info = JSON.parse(rows[0].teacher_id);
            // const language_info = JSON.parse(rows[0].language);
            try {

                // check for teacher

                const connection = await createConnection();
                const [userRows] = await connection.execute(
                    'SELECT teacher FROM USER WHERE id = ?',
                    [verified_user_id]
                );
                await connection.end();

                if (userRows.length === 0) {
                    return res.status(400).json({ error: 'User does not exist' });
                }

                const isTeacher = userRows[0].teacher === 1;

                let class_info = [];

                if (isTeacher) {
                    const connection = await createConnection();
                    const [classRows] = await connection.execute(
                        'SELECT teacher_id FROM CLASS WHERE idclass = ?',
                        [class_id]
                    );
                    await connection.end();

                    if (classRows.length === 0) {
                        return res.status(400).json({ error: 'Class does not exist' });
                    }

                    let teacher_ids = JSON.parse(classRows[0].teacher_id);

                    if (!teacher_ids.includes(verified_user_id)) {
                        teacher_ids.push(verified_user_id);


                        const updateConnection = await createConnection();
                        await updateConnection.execute(
                            'UPDATE CLASS SET teacher_id = ? WHERE idclass = ?',
                            [JSON.stringify(teacher_ids), class_id]
                        );
                        await updateConnection.end();
                    }

                    class_info = await getClassesInfoWithTeacher(verified_user_id);

                } else {

                    const connection = await createConnection();
                    await connection.execute(
                        'UPDATE USER SET class = ? WHERE id = ?',
                        [class_id, verified_user_id]
                    );
                    await connection.end();

                    class_info.push(await getClassInfo(class_id));
                }

                res.json({ message: 'Successfully enrolled in the class', class_info });

            } catch (error) {
                console.error('Error adding student to class:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Error verifying class code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// post a message
app.post('/message/create', verifyTokenMiddleware, async (req, res) => {
    const { message, language_id, class_id } = req.body;
    const verified_user_id = req.verified_user_id;
    let connection;

    console.log("message", message);

    // Validación del mensaje
    if (!message || typeof message !== "string" || message.trim() === "") {
        return res
            .status(400)
            .json({ error: "El mensaje es obligatorio y no puede estar vacío." });
    }

    console.log("type of language_id: ", typeof language_id);
    // Validación del ID de idioma
    if (!language_id || typeof language_id !== 'number') {
        return res.status(400).json({ error: 'El ID de idioma es obligatorio y debe ser un número.' });
    }


    console.log("type of class_id: ", typeof class_id);
    // Validación del ID de clase
    if (!class_id || typeof class_id !== 'number') {
        return res.status(400).json({ error: 'El ID de clase es obligatorio y debe ser un número.' });
    }

    console.log("Id del usuario: ", verified_user_id);

    // Validación del ID de usuario verificado
    if (!verified_user_id || typeof verified_user_id !== 'number') {
        return res.status(400).json({ error: 'El ID de usuario verificado es obligatorio y debe ser un número.' });
    }

    try {
        connection = await createConnection(); 
        const [rows] = await connection.execute(
            'SELECT id FROM USER WHERE id = ? AND class = ?',
            [verified_user_id, class_id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'No perteneces a esta clase.' });
        }

    } catch (error) {
        console.error('Error fetching class language:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.end();
    }


    let language;
    let languageToSend;

    try {
        connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT language FROM CLASS WHERE idclass = ?',
            [class_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        language = rows[0].language;
        console.log("Language: ", language);

    } catch (error) {
        console.error('Error fetching class language:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.end();
    }

    const parsedLanguages = JSON.parse(language);
    languageToSend = parsedLanguages.find((language) => language.id === language_id);

    if (languageToSend === undefined) {
        return res.status(400).json({ error: 'El lenguaje del mensaje no coincide con el lenguaje de la clase.' });
    }

    let restriction;

    try {
        connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT content FROM RESTRICTION WHERE idrestriction = ?',
            [languageToSend.restrictionId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restriction not found' });
        }

        restriction = rows[0].content;
    } catch (error) {
        console.error('Error fetching restriction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.end(); 
    }

    try {
        const aiResponse = await sendToAI(message, languageToSend.name, restriction);

        const returnMessage = aiResponse.content;

        // Extract the content within <think> tags
        const thinkTagContent = returnMessage.match(/<think>(.*?)<\/think>/s);

        let restOfContent = "Sorry, something went wrong. Please try again.";

        if (thinkTagContent && thinkTagContent[1]) {
            const extractedContent = thinkTagContent[1];
            console.log("Extracted Content: ", extractedContent);

            restOfContent = returnMessage.replace(thinkTagContent[0], "").trim();
            console.log("Rest of Content: ", restOfContent);
        } else {
            console.log("No <think> tag found in the response.");
        }

        res.status(200).json(restOfContent);
    } catch (error) {
        console.error("Error en el servidor:", error);

        // Manejo de errores específicos
        // if (error.message.includes('La IA respondió con un error')) {
        //     res.status(502).json({ error: 'Error en la comunicación con la IA: ' + error.message });
        // } else if (error.message.includes('No se recibió respuesta de la IA')) {
        //     res.status(504).json({ error: 'La IA no está disponible en este momento.' });
        // } else {
        //     res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
        // }

    }
});


app.post('/api/language', async (req, res) => {
    const { name } = req.body;
    const verified_user_id = req.verified_user_id;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO LANGUAGE (name) VALUES (?)',
            [name]
        );
        await connection.end();

        res.status(201).json({ idlanguage: result.insertId, name });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// modify a classes' languages
app.put('/api/language/class', async (req, res) => {
    const { classId, languages } = req.body;
    const verified_user_id = req.verified_user_id;

    if (!classId || !Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [classRows] = await connection.execute(
            'SELECT idclass FROM CLASS WHERE idclass = ?',
            [classId]
        );

        if (classRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Class not found' });
        }

        await connection.execute(
            'UPDATE CLASS SET language = ? WHERE idclass = ?',
            [JSON.stringify(languages), classId]
        );

        await connection.end();

        res.status(200).json({ classId, languages });
    } catch (error) {
        console.error('Error updating languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get all languages
app.get("/api/language", verifyTokenMiddleware, async (req, res) => {
    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM LANGUAGE",
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }

        const language_info = rows.map(({ idlanguage, name }) => ({ idlanguage, name }));
        res
            .status(200)
            .json( language_info );
    } catch (error) {
        console.error("Error fetching languages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// delete a language
app.delete("/api/language", verifyTokenMiddleware, async (req, res) => {
    const { idlanguage } = req.body;

    if (!idlanguage) {
        return res.status(400).json({ error: "Idlanguage is required" });
    }

    try {
        const connection = await createConnection();

        const [result] = await connection.execute(
            `DELETE FROM LANGUAGES WHERE idlanguage = ?`,
            [idlanguage]
        );

        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Language not found" });
        }

        res.status(200).json({ message: "Language deleted successfully" });
    } catch (error) {
        console.error("Error in attempt to delete language", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// get all users from a class
app.get("/api/class/user", verifyTokenMiddleware, async (req, res) => {
    const { class_id } = req.query;

    if (!class_id) {
        return res.status(400).json({ error: "Class ID is required" });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            "SELECT name, gmail FROM USER WHERE class_id = ?",
            [class_id]
        );
        await connection.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function getClassesInfoWithTeacher(user_id) {
    const classesWithTeacher = await getClassesWithTeacher(user_id);
    let class_info = [];
    if (classesWithTeacher.length > 0) {
        for (const classId of classesWithTeacher) {
            class_info.push(await getClassInfo(classId));
        }
        console.log(class_info);
    }
    return class_info;
}

function getClassesWithTeacher(user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                "SELECT idclass, teacher_id FROM CLASS",
            );
            await connection.end();



            if (rows.length === 0) {
                reject("No classes found for teacher");
            } else {
                const classesWithTeacher = rows.filter(row => {
                    const teacherIds = JSON.parse(row.teacher_id);
                    return teacherIds.includes(user_id);
                }).map(row => row.idclass);

                resolve(classesWithTeacher);
            }
        } catch (error) {
            reject("Internal server error");
        }
    });
}

function getClassInfo(class_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                'SELECT name, language, teacher_id FROM CLASS WHERE idclass = ?',
                [class_id]
            );
            await connection.end();


            if (rows.length === 0) {
                reject('Class does not exist info info info');
            } else {
                const connection = await createConnection();
                const [classmates] = await connection.execute(
                    'SELECT id, name FROM USER WHERE class = ?',
                    [class_id]
                );
                await connection.end();


                const classmate_info = classmates.map(({ id, name }) => ({ id, name }));


                const { name, language, teacher_id } = rows[0];


                const parsed_teacher_id = JSON.parse(teacher_id);


                console.log("ID professors: ", parsed_teacher_id);


                const teacher_info = await Promise.all(parsed_teacher_id.map(async (id) => {
                    const connection = await createConnection();
                    const [teacher] = await connection.execute(
                        'SELECT name FROM USER WHERE id = ?',
                        [id]
                    );
                    await connection.end();

                    console.log("Teacher info after SELECT: ", teacher[0]);

                    return { id, name: teacher[0].name };
                }));



                console.log(language);
                const language_info = JSON.parse(language);
                console.log(language_info);

                resolve({ class_id, name, language_info, teacher_info, classmate_info });
            }
        } catch (error) {
            reject(error);
        }
    });
}

const sendToAI = async (message, language, restriction) => {
    console.log("sending message");
    const response = await fetch(`http://${AIHOST}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrompt: message, language, restriction })
    });

    console.log("answer recieved");

    if (!response.ok) {
        throw new Error("La IA respondió con un error: " + response.statusText);
    }

    const aiResponse = await response.json();

    if (!aiResponse) {
        throw new Error("No se recibió respuesta de la IA");
    }

    console.log(aiResponse);

    console.log("answer sent back");

    return aiResponse;
};

app.get('/', (req, res) => {
    res.send('This is the back end!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
