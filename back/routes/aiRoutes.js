import express from "express";
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";
import dotenv from 'dotenv';
import Message from "../schemes/mongoScheme.js"

dotenv.config();

const router = express.Router();

const AIHOST = process.env.AIHOST;


// post a message
router.post('/create', verifyTokenMiddleware, async (req, res) => {
    const { message, language_id, class_id } = req.body;
    const verified_user_id = req.verified_user_id;
    let connection;
    const objToSaveMongoDB = {
        userContent: message,
        aiContent: "",
        aiThought: "",
        userId: verified_user_id,
        language: "",
        languageId: language_id,
        classId: class_id
    }

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

    objToSaveMongoDB.language = languageToSend.name;


    saveMessage(objToSaveMongoDB);

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

const sendToAI = async (message, language, restriction) => {
    console.log("sending message");
    const response = await fetch(`${AIHOST}`, {
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

export async function saveMessage(obj) {
    const message = new Message(obj);
    await message.save();
}

export default router;
