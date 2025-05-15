/**
 * Google Routes for handling user login and registration via Google authentication.
 * 
 * This module defines an endpoint for authenticating users using their Google accounts.
 * It validates the user's email domain, determines their role (teacher or student),
 * and manages user data in the database.
 * 
 * @module googleRoutes
 */
import express from "express";
import { login } from '../tokens.js';
import { getClassInfo, getClassesInfoWithTeacher, createConnection } from "../utils.js";

const router = express.Router();

/**
 * POST /
 * 
 * Handles user login or registration via Google authentication.
 * Validates the user's email domain, determines their role (teacher or student),
 * and retrieves or creates their record in the database.
 * 
 * @param {string} uid - The unique Google ID of the user.
 * @param {string} name - The name of the user.
 * @param {string} gmail - The Gmail address of the user.
 * @returns {Object} Authentication result, including a token, user details, and class information.
 * 
 * @throws {Error} Returns a 400 status if the email domain is invalid.
 *                 Returns a 500 status if there is an internal server error.
 */
router.post('/', async (req, res) => {
    const { uid, name, gmail } = req.body;

    if (!gmail.endsWith('@inspedralbes.cat')) {
        return res.status(400).json({ error: 'Incorrect Credentials' });
    }

    const ltterLtter = /^[a-zA-Z]{2}/;


    let teacher = 0;

    if (ltterLtter.test(gmail)) {
        teacher = 1;
    }

    try {
        const connection = await createConnection();
        // Check if the user already exists in the database
        const [rows] = await connection.execute(
            "SELECT * FROM USER WHERE googleId = ?",
            [uid]
        );

        let userId;
        let classId = null;
        let class_info = [];


        if (rows.length === 0) { // user doesn't exist
            const [result] = await connection.execute(
                "INSERT INTO USER (googleId, name, gmail, teacher) VALUES (?, ?, ?, ?)",
                [uid, name, gmail, teacher]
            );
            userId = result.insertId;

            console.log("New user created in the database");
        } else { // user exists
            console.log("User already exists in the database");

            userId = rows[0].id;
            classId = rows[0].class;
            teacher = rows[0].teacher;

            if (teacher === 1) { // teacher
                class_info = await getClassesInfoWithTeacher(userId);
            } else { // student
                if (classId) {
                    class_info.push(await getClassInfo(classId, userId));
                }
            }
        }

        await connection.end();
        const user = { id: userId };
        const token = login(user, process.env.SECRET_KEY)

        res.json({
            message: "User authenticated correctly",
            token,
            id: userId,
            name,
            gmail,
            teacher,
            class_id: class_info ? class_info.class_id : null,
            class_info: class_info
        });
    } catch (error) {
        console.error("Authenticated failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
