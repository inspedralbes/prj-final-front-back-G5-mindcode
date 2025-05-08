import express from "express";
import Message from "../schemes/mongoScheme.js";
import Quiz from "../schemes/quizScheme.js";
import { verifyTokenMiddleware } from "../tokens.js";


const router = express.Router();

// Route to get all messages with a specific classId
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

router.get('/student/:studentId', verifyTokenMiddleware, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const messages = await Message.find({ userId: studentId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
});


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