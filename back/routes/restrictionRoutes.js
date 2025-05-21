/**
 * Restriction Routes for managing restrictions.
 * 
 * This module defines endpoints for retrieving restrictions from the database.
 * It integrates with a Sequelize model to fetch restriction data.
 * 
 * @module restrictionRoutes
 */
import express from 'express';
import { Restriction } from '../models/index.js'; // Adjust the path to your Sequelize models

const router = express.Router();

/**
 * GET /
 * 
 * Retrieves all restrictions from the database.
 * 
 * @returns {Array} List of restrictions.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
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