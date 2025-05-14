/**
 * Stats Routes for retrieving statistics related to messages and quizzes.
 * 
 * This module defines endpoints for fetching messages and quizzes based on class or student IDs.
 * It integrates with MongoDB schemas to retrieve the required data.
 * 
 * @module statsRoutes
 */
import express from "express";
import Message from "../schemes/mongoScheme.js";
import Quiz from "../schemes/quizScheme.js";
import { verifyTokenMiddleware } from "../tokens.js";


const router = express.Router();

/**
 * GET /:classId
 * 
 * Retrieves all messages associated with a specific class.
 * 
 * @param {string} classId - The ID of the class.
 * @returns {Array} List of messages for the specified class.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
router.get('/:classId', verifyTokenMiddleware,  async (req, res) => {
    const { classId } = req.params;
    
    try {
        const messages = await Message.find({ classId });
        console.log(messages);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
});

/**
 * GET /student/:studentId
 * 
 * Retrieves all messages sent by a specific student.
 * 
 * @param {string} studentId - The ID of the student.
 * @returns {Array} List of messages sent by the specified student.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
router.get('/student/:studentId', verifyTokenMiddleware, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const messages = await Message.find({ userId: studentId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
});

/**
 * GET /quizz/:classId
 * 
 * Retrieves all quizzes associated with a specific class.
 * 
 * @param {string} classId - The ID of the class.
 * @returns {Array} List of quizzes for the specified class.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
router.get('/quizz/:classId', verifyTokenMiddleware,  async (req, res) => {
    const { classId } = req.params;
    
    try {
        const quizzes = await Quiz.find({ classId });
        console.log(quizzes);
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching quizzes.' });
    }
});

/**
 * GET /quizz/student/:studentId
 * 
 * Retrieves all quizzes taken by a specific student.
 * 
 * @param {string} studentId - The ID of the student.
 * @returns {Array} List of quizzes taken by the specified student.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
router.get('/quizz/student/:studentId', verifyTokenMiddleware, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const quizzes = await Quiz.find({ userId: studentId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching quizzes.' });
    }
});


export default router;