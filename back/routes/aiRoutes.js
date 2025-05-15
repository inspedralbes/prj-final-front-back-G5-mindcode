/**
 * AI Routes for handling user interactions, AI responses, and quiz generation.
 * 
 * This module defines various endpoints for creating messages, generating quizzes,
 * and processing quiz responses. It integrates with an AI service and MongoDB for
 * storing and retrieving data.
 * 
 * @module aiRoutes
 */

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

const AIHOST = process.env.AIHOST || "https://ia.inspedralbes.cat";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /create
 * 
 * Creates a new message, validates input, interacts with an AI service, and saves the response.
 * If the user has sent 5 messages, a quiz is generated based on the messages.
 * 
 * @param {string} message - The user's message.
 * @param {number} language_id - The ID of the language.
 * @param {number} class_id - The ID of the class.
 * @returns {Object} AI response or error message.
 */
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

    try {
        console.log("Sending to AI");
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

      objToSaveMongoDB.aiContent = restOfContent;
      objToSaveMongoDB.aiThought = thinkTagContent ? thinkTagContent[1] : '';
      

      try {
        const connection = await createConnection();
        const [result] = await connection.execute(
          'UPDATE USER SET message_count = message_count + 1 WHERE id = ?',
          [verified_user_id]
        );

        const [rows] = await connection.execute(
          'SELECT message_count FROM USER WHERE id = ?',
          [verified_user_id]
        );

        const messageCount = rows[0].message_count;
        console.log(`Contador de mensajes: ${messageCount}`);

        if (messageCount >= 5) {
          console.log('5 mensajes detectados, generando quiz...');
          const messages = await Message.find({ 
            userId: verified_user_id,
            classId: class_id 
          })
          .sort({ _id: -1 })
          .limit(5)
          .lean();

          const formattedMessages = messages.map(msg => msg.userContent).join('\n');
          const quizResponse = await sendForQuiz(formattedMessages);

          if (quizResponse && quizResponse.quiz && Array.isArray(quizResponse.quiz)) {
            const quiz = new Quiz({
              userId: verified_user_id,
              classId: class_id,
              questions: quizResponse.quiz,
              userAnswers: [],
              createdAt: new Date()
            });
            await quiz.save();
            console.log('Quiz generated and saved in MongoDB:', quiz._id);

            await connection.execute(
              'UPDATE USER SET message_count = 0 WHERE id = ?',
              [verified_user_id]
            );
          }
        }

        await connection.end();
      } catch (error) {
        console.error('Error al procesar mensajes:', error);
      } 

      res.status(200).json(restOfContent);
  } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: "Internal server error" });
  } finally {
    saveMessage(objToSaveMongoDB);
  }
});

/**
 * Sends a message to the AI service.
 * 
 * @async
 * @function sendToAI
 * @param {string} message - The user's message.
 * @param {string} language - The language of the message.
 * @param {string} restriction - Restrictions for the AI response.
 * @returns {Object} AI response.
 * @throws Will throw an error if the AI service responds with an error or no response.
 */
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

/**
 * Saves a message to MongoDB.
 * 
 * @async
 * @function saveMessage
 * @param {Object} obj - The message object to save.
 */
export async function saveMessage(obj) {
    const message = new Message(obj);
    await message.save();
}

/**
 * POST /api/quiz
 * 
 * Generates a quiz based on the user's last 3 messages.
 * 
 * @param {number} class_id - The ID of the class.
 * @returns {Object} Quiz data or error message.
 */
router.post('/api/quiz', verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.verified_user_id;
    const { class_id } = req.body;
    console.log("en teoria aqui se veria el classid del back: " + class_id);
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
      classId: class_id,
      questions: aiResponse.quiz,
      userAnswers: [],
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

/**
 * POST /api/quizResponse
 * 
 * Processes the user's quiz responses and updates the quiz in MongoDB.
 * 
 * @param {string} quizId - The ID of the quiz.
 * @param {Array} answers - The user's answers to the quiz questions.
 * @returns {Object} Quiz results or error message.
 */
router.post('/api/quizResponse', verifyTokenMiddleware, async (req, res) => {
  try {
    const { quizId, answers } = req.body; 
    const userId = req.verified_user_id;
    console.log('Received quiz response:', { quizId, answers });

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        status: "error",
        description: "Quiz ID and answers array are required"
      });
    }

    const validAnswers = answers.every(answer => {
      return answer.question_id && (answer.selected_option !== undefined || answer.value !== undefined);
    });

    if (!validAnswers) {
      return res.status(400).json({
        status: "error",
        description: "Invalid answer format. Each answer must have question_id and either selected_option or value"
      });
    }
  
    try {
      const quiz = await Quiz.findById(quizId);
      console.log('Found quiz:', quiz);
  
      if (!quiz) {
        return res.status(404).json({
          status: "error",
          description: "Quiz not found"
        });
      }
      const results = answers.map(answer => {
        const question = quiz.questions.find(q => q.question_id === answer.question_id);
        if (!question) return null;

        const baseAnswer = {
          question_id: answer.question_id,
          question_type: question.question_type
        };

        if (question.question_type === 'short_answer') {
          return {
            ...baseAnswer,
            value: answer.value,
            isCorrect: answer.value?.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim()
          };
        } else {
          return {
            ...baseAnswer,
            selected_option: answer.selected_option,
            isCorrect: answer.selected_option === question.correct_option,
            correct_option: question.correct_option
          };
        }
      }).filter(result => result !== null);

      const correctAnswersCount = results.filter(result => result.isCorrect).length;

      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { 
          $set: { 
            userAnswers: results,
            correctAnswers: correctAnswersCount,
            'questions.$[].isAnswered': true 
          } 
        },
        { new: true }
      );

      console.log('Quiz response saved in MongoDB:', results);

      res.status(200).json({
        status: "success",
        results,
        questions: quiz.questions
      });
    } catch (error) {
      console.error('Error processing quiz response:', error);
      res.status(500).json({
        status: "error",
        description: "Internal server error while processing quiz response"
      });
    }
  } catch (error) {
    console.error('Error in quiz response route:', error);
    res.status(500).json({
      status: "error",
      description: "Internal server error"
    });
  }
});

/**
 * Sends formatted messages to the AI service for quiz generation.
 * 
 * @async
 * @function sendForQuiz
 * @param {string} formattedMessages - The user's messages formatted as a single string.
 * @returns {Object} AI-generated quiz.
 * @throws Will throw an error if the AI service responds with an error or no response.
 */
const sendForQuiz = async (formattedMessages) => {
console.log("Sending message to AI:", formattedMessages);
console.log("AIHOST actual:", AIHOST);

const response = await fetch(`${AIHOST}/generateQuiz`, {
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

/**
 * GET /check-quiz
 * 
 * Checks if there is an unanswered quiz available for the user.
 * 
 * @returns {Object} Quiz availability and details or error message.
 */
router.get('/check-quiz', verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.verified_user_id;
    const latestQuiz = await Quiz.findOne({
      userId: userId,
      'questions.isAnswered': { $ne: true }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      quizAvailable: !!latestQuiz,
      quiz: latestQuiz?.questions || null,
      quizId: latestQuiz?._id || null
    });
  } catch (error) {
    console.error('Error checking quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
