/**
 * Language Routes for managing languages and their association with classes.
 * 
 * This module defines endpoints for creating, retrieving, updating, and deleting languages,
 * as well as managing the association of languages with classes.
 * 
 * @module languageRoutes
 */
import express from "express";
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";

const router = express.Router();

/**
 * POST /
 * 
 * Creates a new language.
 * 
 * @param {string} name - The name of the language.
 * @returns {Object} The created language's ID and name.
 * 
 * @throws {Error} Returns a 400 status if the input is invalid.
 *                 Returns a 500 status if there is an internal server error.
 */
router.post('/', async (req, res) => {
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

        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /class/add
 * 
 * Adds a language to a class.
 * 
 * @param {number} classId - The ID of the class.
 * @param {Object} language - The language object containing `id`, `name`, and `restrictionId`.
 * @returns {Object} Success message, class ID, and updated list of languages.
 * 
 * @throws {Error} Returns a 400 status if the input is invalid.
 *                 Returns a 404 status if the class or language is not found.
 *                 Returns a 409 status if the language already exists in the class.
 *                 Returns a 500 status if there is an internal server error.
 */
router.post('/class/add', async (req, res) => {
    const { classId, language } = req.body;
    if (!classId || !language || !language.name || !language.id || !language.restrictionId) {
        return res.status(400).json({ error: 'Invalid input. Class ID, language ID, name, and restrictionId are required.' });
    }
    try {
        const connection = await createConnection();
        const [classRows] = await connection.execute(
            'SELECT idclass, language FROM CLASS WHERE idclass = ?',
            [classId]
        );
        if (classRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Class not found' });
        }
        const [languageRows] = await connection.execute(
            'SELECT id, name FROM LANGUAGE WHERE id = ?',
            [language.id]
        );
        if (languageRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Language not found' });
        }
        if (![1, 2, 3].includes(language.restrictionId)) {
            await connection.end();
            return res.status(400).json({ error: 'Invalid restriction ID. Must be 1, 2, or 3.' });
        }
        let currentLanguages = JSON.parse(classRows[0].language || "[]");
        if (currentLanguages.some(lang => lang.id === language.id)) {
            await connection.end();
            return res.status(409).json({ error: 'Language already exists in class' });
        }
        currentLanguages.push(language);
        await connection.execute(
            'UPDATE CLASS SET language = ? WHERE idclass = ?',
            [JSON.stringify(currentLanguages), classId]
        );
        await connection.end();
        res.status(200).json({ message: 'Language added successfully', classId, languages: currentLanguages });
    } catch (error) {
        console.error('Error adding language to class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /
 * 
 * Retrieves all available languages.
 * 
 * @returns {Array} List of languages with their IDs and names.
 * 
 * @throws {Error} Returns a 500 status if there is an internal server error.
 */
router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT id, name FROM LANGUAGE");
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * PUT /class
 * 
 * Updates the list of languages associated with a class.
 * 
 * @param {number} classId - The ID of the class.
 * @param {Array} languages - The updated list of languages.
 * @returns {Object} The class ID and updated list of languages.
 * 
 * @throws {Error} Returns a 400 status if the input is invalid.
 *                 Returns a 404 status if the class is not found.
 *                 Returns a 500 status if there is an internal server error.
 */
router.put('/class', async (req, res) => {
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

/**
 * DELETE /class
 * 
 * Removes a language from a class.
 * 
 * @param {number} classId - The ID of the class.
 * @param {number} languageId - The ID of the language to remove.
 * @returns {Object} Success message, class ID, and updated list of languages.
 * 
 * @throws {Error} Returns a 400 status if the input is invalid.
 *                 Returns a 404 status if the class or language is not found.
 *                 Returns a 500 status if there is an internal server error.
 */
router.delete("/class", verifyTokenMiddleware, async (req, res) => {
    const classId = parseInt(req.query.classId);
    const languageId = parseInt(req.query.languageId);

    console.log("classId", classId);
    console.log("languageId", languageId);
  
    if (!classId || !languageId) {
      return res.status(400).json({ error: 'classId and languageId are required' });
    }
  
    try {
      const connection = await createConnection();
  
      const [classRows] = await connection.execute(
        'SELECT idclass, language FROM CLASS WHERE idclass = ?',
        [classId]
      );
  
      if (classRows.length === 0) {
        await connection.end();
        return res.status(404).json({ error: 'Class not found' });
      }
  
      let currentLanguages = JSON.parse(classRows[0].language || "[]");

      console.log("currentLanguages", currentLanguages);
  
      const filteredLanguages = currentLanguages.filter(
        (lang) => lang.id !== languageId
      );

      console.log("filteredLanguages", filteredLanguages);
  
      if (filteredLanguages.length === currentLanguages.length) {
        await connection.end();
        return res.status(404).json({ error: 'Language not found in class' });
      }
  
      await connection.execute(
        'UPDATE CLASS SET language = ? WHERE idclass = ?',
        [JSON.stringify(filteredLanguages), classId]
      );
  
      await connection.end();
      res.status(200).json({
        message: 'Language removed successfully from class',
        classId,
        languages: filteredLanguages,
      });
    } catch (error) {
      console.error('Error removing language from class:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default router;