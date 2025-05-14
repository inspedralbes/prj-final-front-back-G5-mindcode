/**
 * Class Routes for managing class-related operations such as creating classes,
 * enrolling users, fetching class information, and managing users in classes.
 * 
 * This module defines various endpoints for handling class operations and integrates
 * with a database for storing and retrieving class and user data.
 * 
 * @module classRoutes
 */

import express from "express";
import { createConnection } from "../utils.js";
import { verifyTokenMiddleware } from "../tokens.js";
import ShortUniqueId from 'short-unique-id';
import { getClassInfo, getClassesInfoWithTeacher } from "../utils.js";

const router = express.Router();

// Unique ID generator used in class code generation
const uid = new ShortUniqueId({ length: 10 });

/**
 * GET /
 * 
 * Fetches information about classes. If a `class_id` is provided, it fetches
 * information for a specific class; otherwise, it fetches all classes.
 * 
 * @param {number} [class_id] - The ID of the class to fetch.
 * @returns {Object} Class information or error message.
 */
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

/**
 * POST /
 * 
 * Creates a new class. Only teachers are authorized to create classes.
 * 
 * @param {string} name - The name of the class.
 * @returns {Object} Created class information or error message.
 */
router.post('/', verifyTokenMiddleware, async (req, res) => {
    const { name } = req.body;
    const verified_user_id = req.verified_user_id;
    console.log(verified_user_id);

    const language = "[]";

    if (!name || !verified_user_id) {
        return res.status(400).json({ error: 'Class name and teacher ID are required' });
    }


    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id, teacher FROM USER WHERE id = ?',
            [verified_user_id]
        );
        await connection.end();

        console.log(rows);


        if (rows.length === 0) {
            return res.status(401).json({ error: 'You are not authorized to take that action' });
        }

        if (rows[0].teacher !== 1) {
            return res.status(401).json({ error: 'You are not a teacher' });
        }
    } catch (error) {
        console.error('Error verifying teacher ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    const class_code = uid.rnd();


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

/**
 * POST /enroll
 * 
 * Enrolls a user into a class using a class code. Teachers can also enroll themselves
 * as additional teachers for a class.
 * 
 * @param {string} class_code - The code of the class to enroll in.
 * @returns {Object} Enrollment status, class information, and user role (teacher or student).
 */
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

                    class_info.push(await getClassInfo(class_id, verified_user_id));
                }

                res.json({ message: 'Successfully enrolled in the class', class_info, isTeacher: isTeacher });

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

/**
 * GET /user
 * 
 * Fetches all users in a specific class.
 * 
 * @param {number} class_id - The ID of the class.
 * @returns {Array} List of users in the class or error message.
 */
router.get("/user", verifyTokenMiddleware, async (req, res) => {
    const { class_id } = req.query;

    if (!class_id) {
        return res.status(400).json({ error: "Class ID is required" });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            "SELECT id, name, teacher, gmail FROM USER WHERE class = ?",
            [class_id]
        );
        await connection.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * PUT /leave
 * 
 * Allows a user to leave a class. If the user is a teacher, their ID is removed
 * from the `teacher_id` array of the class.
 * 
 * @param {number} id - The ID of the user leaving the class.
 * @param {number} class_id - The ID of the class to leave.
 * @returns {Object} Success message or error message.
 */
router.put('/leave', verifyTokenMiddleware, async (req, res) => {
    const { id, class_id } = req.body;

    if (!id || !class_id) {
        return res.status(400).json({ error: 'User ID and Class ID are required' });
    }

    try {
        const connection = await createConnection();

        // Eliminar al usuario de la clase (campo `class` en la tabla `USER`)
        const [result] = await connection.execute(
            'UPDATE USER SET class = NULL WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            await connection.end();
            return res.status(404).json({ error: 'User not found or already not in any class' });
        }

        // Obtener el array de teacher_id de la clase
        const [classRows] = await connection.execute(
            'SELECT teacher_id FROM CLASS WHERE idclass = ?',
            [class_id]
        );

        if (classRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Class not found' });
        }

        let teacherIds = JSON.parse(classRows[0].teacher_id);

        // Eliminar el ID del usuario del array de teacher_id si existe
        if (teacherIds.includes(id)) {
            teacherIds = teacherIds.filter((teacherId) => teacherId !== id);

            // Actualizar el campo teacher_id en la tabla CLASS
            await connection.execute(
                'UPDATE CLASS SET teacher_id = ? WHERE idclass = ?',
                [JSON.stringify(teacherIds), class_id]
            );
        }

        await connection.end();

        res.status(200).json({ message: 'Successfully left the class and removed from teacher_id array if applicable' });
    } catch (error) {
        console.error('Error leaving class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /user/info
 * 
 * Fetches information about all classes associated with the authenticated user.
 * 
 * @returns {Object} Class information or error message.
 */
router.get("/user/info", verifyTokenMiddleware, async (req, res) => {
    getClassesInfoWithTeacher(req.verified_user_id).then((class_info) => {
        res.status(200).json({ class_info: class_info });
    }).catch((error) => {
        console.error("Error fetching classes:", error);
        res.status(500).json({ error: "Internal server error" });
    });
});

export default router;

