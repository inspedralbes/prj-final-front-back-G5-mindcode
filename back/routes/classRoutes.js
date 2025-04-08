import express from "express";
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";
import ShortUniqueId from 'short-unique-id';

const router = express.Router();

// Unique ID generator used in class code generation
const uid = new ShortUniqueId({ length: 10 });

router.get('/', async (req, res) => {
    const { class_id } = req.query;
  
    try {
        const connection = await createConnection();
        
        let query = "SELECT idclass, name, teacher_id, language, code FROM CLASS";
        let params = [];
  
        if (class_id) {
            query += " WHERE idclass = ?";
            params.push(class_id);
        }
  
        const [rows] = await connection.execute(query, params);
        await connection.end();
  
        if (rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }
  
        const classes = rows.map(classItem => ({
            class_id: classItem.idclass,
            name: classItem.name,
            teacher_id: JSON.parse(classItem.teacher_id),
            language: JSON.parse(classItem.language),
            class_code: classItem.code
        }));
  
        res.status(200).json(class_id ? classes[0] : classes);
    } catch (error) {
        console.error("Error fetching class information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  });

  // create a class
  router.post('/', verifyTokenMiddleware, async (req, res) => {
      const { name } = req.body;
      const verified_user_id = req.verified_user_id;
  
      const language = "[]"; /* TODO: Add language array to class creation */
  
      if (!name || !verified_user_id) {
          return res.status(400).json({ error: 'Class name and teacher ID are required' });
      }
  
  
      try {
          const connection = await createConnection();
          const [rows] = await connection.execute(
              'SELECT id FROM USER WHERE id = ? AND teacher = "1"',
              [verified_user_id]
          );
          await connection.end();
  
  
          if (rows.length === 0) {
              return res.status(401).json({ error: 'You are not authorized to take that action' });
          }
      } catch (error) {
          console.error('Error verifying teacher ID:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  
  
      const class_code = uid.rnd();
  
  
      console.log(class_code);
  
  
      try {
          const connection = await createConnection();
          const [result] = await connection.execute(
              'INSERT INTO CLASS (name, teacher_id, language, code) VALUES (?, ?, ?, ?)',
              [name, JSON.stringify([verified_user_id]), language, class_code]
          );
          await connection.end();
  
          const class_info = await getClassesInfoWithTeacher(verified_user_id);
          res.status(201).json(class_info);
      } catch (error) {
          console.error('Error creating class:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  // enroll into a class
  router.post('/enroll', verifyTokenMiddleware, async (req, res) => {
      const { class_code } = req.body;
      const verified_user_id = req.verified_user_id
  
      if (!class_code) {
          return res
              .status(400)
              .json({ error: "Class code is required" });
      }
  
      try {
          const connection = await createConnection();
          const [rows] = await connection.execute(
              'SELECT idclass FROM CLASS WHERE code = ?',
              [class_code]
          );
          await connection.end();
  
  
          if (rows.length === 0) {
              return res.status(400).json({ error: 'Class does not exist' });
          } else {
              const class_id = rows[0].idclass;
              // const teacher_info = JSON.parse(rows[0].teacher_id);
              // const language_info = JSON.parse(rows[0].language);
              try {
  
                  // check for teacher
  
                  const connection = await createConnection();
                  const [userRows] = await connection.execute(
                      'SELECT teacher FROM USER WHERE id = ?',
                      [verified_user_id]
                  );
                  await connection.end();
  
                  if (userRows.length === 0) {
                      return res.status(400).json({ error: 'User does not exist' });
                  }
  
                  const isTeacher = userRows[0].teacher === 1;
  
                  let class_info = [];
  
                  if (isTeacher) {
                      const connection = await createConnection();
                      const [classRows] = await connection.execute(
                          'SELECT teacher_id FROM CLASS WHERE idclass = ?',
                          [class_id]
                      );
                      await connection.end();
  
                      if (classRows.length === 0) {
                          return res.status(400).json({ error: 'Class does not exist' });
                      }
  
                      let teacher_ids = JSON.parse(classRows[0].teacher_id);
  
                      if (!teacher_ids.includes(verified_user_id)) {
                          teacher_ids.push(verified_user_id);
  
  
                          const updateConnection = await createConnection();
                          await updateConnection.execute(
                              'UPDATE CLASS SET teacher_id = ? WHERE idclass = ?',
                              [JSON.stringify(teacher_ids), class_id]
                          );
                          await updateConnection.end();
                      }
  
                      class_info = await getClassesInfoWithTeacher(verified_user_id);
  
                  } else {
  
                      const connection = await createConnection();
                      await connection.execute(
                          'UPDATE USER SET class = ? WHERE id = ?',
                          [class_id, verified_user_id]
                      );
                      await connection.end();
  
                      class_info.push(await getClassInfo(class_id));
                  }
  
                  res.json({ message: 'Successfully enrolled in the class', class_info });
  
              } catch (error) {
                  console.error('Error adding student to class:', error);
                  return res.status(500).json({ error: 'Internal server error' });
              }
          }
      } catch (error) {
          console.error('Error verifying class code:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  });

  // get all users from a class
  router.get("/api/class/user", verifyTokenMiddleware, async (req, res) => {
      const { class_id } = req.query;
  
      if (!class_id) {
          return res.status(400).json({ error: "Class ID is required" });
      }
  
      try {
          const connection = await createConnection();
          const [rows] = await connection.execute(
              "SELECT name, gmail FROM USER WHERE class_id = ?",
              [class_id]
          );
          await connection.end();
  
          res.status(200).json(rows);
      } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  });

export default router;

