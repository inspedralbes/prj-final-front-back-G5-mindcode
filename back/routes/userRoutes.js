import express from "express";
import { verifyTokenMiddleware } from "../tokens.js";
import { createConnection } from "../utils.js";
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const router = express.Router();

const uploads = './uploads';
if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const randomName = crypto.randomBytes(16).toString('hex') + ext;
      cb(null, randomName);
    }
  });
  const upload = multer({ storage });

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
router.put('/', verifyTokenMiddleware, async (req, res) => {
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

router.post('/uploadimg/:id', verifyTokenMiddleware, upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const fileName = req.file.filename;
  
    try {
      const connection = await createConnection();
      await connection.execute(
        'UPDATE USER SET img = ? WHERE id = ?',
        [fileName, userId]
      );
      await connection.end();
  
      res.status(200).json({ message: 'Imagen subida correctamente', fileName });
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/getimg/:id', verifyTokenMiddleware, upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const fileName = req.file.filename;
  
    try {
      const connection = await createConnection();
      await connection.execute(
        'SELECT USER img = ? WHERE id = ?',
        [fileName, userId]
      );
      await connection.end();
  
      res.status(200).json({ message: 'Imagen subida correctamente', fileName });
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
export default router;