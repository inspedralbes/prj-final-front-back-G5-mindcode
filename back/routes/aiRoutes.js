import express from "express";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";
import dotenv from 'dotenv';
import Message from "../schemes/mongoScheme.js"
import Quiz from "../schemes/quizScheme.js"

dotenv.config();

const router = express.Router();

const AIHOST = process.env.AIHOST;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const response = await fetch(`http://${AIHOST}:4567`, {
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


router.post('/api/quizResponse', verifyTokenMiddleware, async (req, res) => {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({
            status: "error",
            description: "Questions array is required"
        });
    }

    try {
        const answered = questions.map((userAnswer, index) => {
            const question = quizData.quiz[index];
            if (!question) return 0;
            
            return userAnswer === question.correct_option ? 1 : 0;
        });

        return res.status(200).json({
            status: "success",
            description: "Quiz response successfully",
            body: [
                {
                    answered: answered
                }
            ]
        });

    } catch (error) {
        console.error('Error in quiz response:', error);
        return res.status(500).json({
            status: "error",
            description: "Internal server error while processing quiz response"
        });
    }
});

router.post('/api/quiz', verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.verified_user_id;
    const classId = req.body.class_id;

    const messages = await Message.find({ userId })
      .sort({ _id: -1 })
      .limit(3)
      .select('userContent')
      .lean();

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "There are not enough messages to generate the questionnaire." });
    }

    const formattedMessages = messages.map(msg => msg.userContent).join("\n");
    console.log('Messages received from user:', formattedMessages);
    const aiResponse = await sendForQuiz(formattedMessages);
    console.log('AI response:', aiResponse);

    if (!aiResponse || !aiResponse.quiz || !Array.isArray(aiResponse.quiz)) {
      return res.status(500).json({ error: "AI did not return a valid response:" });
    }

    const quiz = new Quiz({
      userId,
      classId: classId || 1,
      questions: aiResponse.quiz,
      userAnswers: [],
      createdAt: new Date()
    });

    const savedQuiz = await quiz.save();
    console.log('Quiz saved in MongoDB:', savedQuiz._id);

    res.status(200).json({
      quiz: aiResponse.quiz,
      quizId: savedQuiz._id
    });

  } catch (error) {
    console.error('Error processing quiz:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});


router.post('/api/quizResponse', verifyTokenMiddleware, async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.verified_user_id;

    if (!quizId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
            status: "error",
            description: "Quiz ID and answers are required"
        });
    }

    try {
        const quiz = await Quiz.findOne({ _id: quizId, userId });

        if (!quiz) {
            return res.status(404).json({
                status: "error",
                description: "Quiz not found"
            });
        }

        const results = answers.map(answer => {
            const question = quiz.questions.find(q => q.question_id === answer.question_id);
            if (!question) return null;

            return {
                question_id: answer.question_id,
                isCorrect: question.correct_option === answer.selected_option,
                selected_option: answer.selected_option,
                correct_option: question.correct_option
            };
        }).filter(result => result !== null);

        quiz.userAnswers = answers;
        await quiz.save();

        return res.status(200).json({
            status: "success",
            description: "Answers processed successfully",
            results
        });

    } catch (error) {
        console.error('Error processing quiz answers:', error);
        return res.status(500).json({
            status: "error",
            description: "Internal error while processing answers"
        });
    }
});


const sendForQuiz = async (formattedMessages) => {
console.log("Sending message to AI:", formattedMessages);
console.log("AIHOST actual:", AIHOST);

const response = await fetch(`http://${AIHOST}:4567/generateQuiz`, {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({userPrompt: formattedMessages})
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

export default router;
