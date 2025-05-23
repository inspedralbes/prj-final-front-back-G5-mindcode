import express from "express";
import { verifyTokenMiddleware } from "../tokens.js";
import { createConnection } from "../utils.js";
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
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


router.post('/uploadimg/:id', verifyTokenMiddleware, async (req, res) => {
  const userId = req.params.id;
  const { photoURL } = req.body;

  if (!photoURL) {
    return res.status(400).json({ error: 'No photoURL provided' });
  }

  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT img FROM USER WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'User not found' });
    }

    const currentImg = rows[0].img;

    if (currentImg) {
      await connection.end();
      return res.status(200).json({ message: 'Image already exists', img: currentImg });
    }

    const response = await axios({
      url: photoURL,
      method: "GET",
      responseType: "stream",
    });

    const fileExtension = path.extname(photoURL) || '.jpg';
    const uniqueFileName = crypto.randomBytes(16).toString('hex') + fileExtension;
    const newPath = path.join(uploadDir, uniqueFileName);

    const writer = fs.createWriteStream(newPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    await connection.execute(
      'UPDATE USER SET img = ? WHERE id = ?',
      [uniqueFileName, userId]
    );
    await connection.end();

    res.status(200).json({ message: 'Image uploaded successfully', img: uniqueFileName });
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getimg/:id', verifyTokenMiddleware, async (req, res) => {
  const userId = req.params.id;

  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT img FROM USER WHERE id = ?',
      [userId]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const img = rows[0].img;

    if (!img) {
      return res.status(200).json({ img: null }); 
    }

    const imgPath = `https://mindcode.cat/back/uploads/${img}`;
    res.status(200).json({ img: imgPath }); 
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;