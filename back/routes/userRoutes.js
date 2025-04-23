import express from "express";
import { verifyTokenMiddleware } from "../tokens.js";
import { createConnection } from "../utils.js";

const router = express.Router();

// Obtener información de un usuario por ID
router.get('/:id', verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, gmail FROM USER WHERE id = ?',
            [id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error); 
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Actualizar información de un usuario
router.put('/api/user', verifyTokenMiddleware, async (req, res) => {
    const { id, name, gmail } = req.body;

    if (!id || !name || !gmail) {
        return res.status(400).json({ error: 'User ID, name, and email are required' });
    }

    try {
        const connection = await createConnection();
        await connection.execute(
            'UPDATE USER SET name = ?, gmail = ? WHERE id = ?',
            [name, gmail, id]
        );
        await connection.end();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dejar una clase
router.put('/api/class/leave', verifyTokenMiddleware, async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'UPDATE USER SET class = NULL WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            await connection.end();
            return res.status(404).json({ error: 'User not found or already not in any class' });
        }

        // Verificar si el usuario es profesor y actualizar si es necesario
        const [userRows] = await connection.execute(
            'SELECT teacher FROM USER WHERE id = ?',
            [id]
        );

        if (userRows.length > 0 && userRows[0].teacher === 1) {
            await connection.execute(
                'UPDATE USER SET teacher = 0 WHERE id = ?',
                [id]
            );
        }

        await connection.end();
        res.status(200).json({ message: 'Successfully left the class' });
    } catch (error) {
        console.error('Error leaving class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;