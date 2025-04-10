import express from "express";
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";

const router = express.Router();

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

        res.status(201).json({ idlanguage: result.insertId, name });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/class/add', async (req, res) => {
    const { classId, language } = req.body;
    if (!classId || !language || !language.name || !language.idlanguage || !language.restrictionId) {
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
            'SELECT idlanguage, name FROM LANGUAGE WHERE idlanguage = ?',
            [language.idlanguage]
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
        if (currentLanguages.some(lang => lang.idlanguage === language.idlanguage)) {
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



// modify a classes' languages
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

// get all languages
router.get("/", verifyTokenMiddleware, async (req, res) => {
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

router.delete("/", verifyTokenMiddleware, async (req, res) => {
    try {
        console.log("🔹 Incoming DELETE request to /");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        const { idlanguage } = req.body;

        if (!idlanguage) {
            console.error("❌ No idlanguage provided in request.");
            return res.status(400).json({ error: "Idlanguage is required" });
        }

        const connection = await createConnection();
        const [result] = await connection.execute(
            `DELETE FROM LANGUAGES WHERE idlanguage = ?`,
            [idlanguage]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            console.error(`❌ No language found with ID: ${idlanguage}`);
            return res.status(404).json({ error: "Language not found" });
        }

        console.log(`✅ Language with ID ${idlanguage} deleted successfully`);
        res.status(200).json({ message: "Language deleted successfully" });

    } catch (error) {
        console.error("❌ Error in attempt to delete language", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;