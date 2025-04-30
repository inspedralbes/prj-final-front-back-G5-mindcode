import express from 'express';
import { Restriction } from '../models/index.js'; // Adjust the path to your Sequelize models

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const restrictions = await Restriction.findAll();
        res.json(restrictions);
    } catch (error) {
        console.error('Error fetching restrictions:', error);
        res.status(500).json({ error: 'Failed to fetch restrictions' });
    }
});

export default router;