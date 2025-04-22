import express from "express";
import Message from "../schemes/mongoScheme.js";
import { verifyTokenMiddleware } from "../tokens.js";


const router = express.Router();

// Route to get all messages with a specific classId
router.get('/:classId', verifyTokenMiddleware,  async (req, res) => {
    const { classId } = req.params;
    
    try {
        const messages = await Message.find({ classId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
});

export default router;