import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from "./schemes/mongoScheme.js"

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};



export async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connection successful');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

export async function testConnection() {
    const connection = await createConnection();
    try {
        await connection.ping();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Database connection test failed:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

export const connectMongo = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('Conectado a MongoDB'))
        .catch(err => console.error('Error al conectar a MongoDB:', err));
}



export async function getClassesInfoWithTeacher(user_id) {
    let class_info = [];
    const connection = await createConnection();
    const [rows] = await connection.execute(
        "SELECT teacher, class FROM USER WHERE id = ?",
        [user_id]
    );
    await connection.end();
    if (rows[0].teacher === 0) {
        const classId = rows[0].class;
        if (classId) {
            class_info.push(await getClassInfo(classId, user_id));
        } else {
            console.log("No class found for student");
        }
    } else {
        const classesWithTeacher = await getClassesWithTeacher(user_id);

        if (classesWithTeacher.length > 0) {
            for (const classId of classesWithTeacher) {
                class_info.push(await getClassInfo(classId, user_id));
            }
            console.log(class_info);
        }
    }
    return class_info;
}

export function getClassesWithTeacher(user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                "SELECT idclass, teacher_id FROM CLASS",
            );
            await connection.end();

            if (rows.length === 0) {
                reject("No classes found for teacher");
            } else {
                const classesWithTeacher = rows.filter(row => {
                    const teacherIds = JSON.parse(row.teacher_id);
                    return teacherIds.includes(user_id);
                }).map(row => row.idclass);

                resolve(classesWithTeacher);
            }
        } catch (error) {
            reject("Internal server error");
        }
    });
}

export function getClassInfo(class_id, user_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                'SELECT name, language, teacher_id FROM CLASS WHERE idclass = ?',
                [class_id]
            );
            await connection.end();


            if (rows.length === 0) {
                reject('Class does not exist info info info');
            } else {
                const connection = await createConnection();
                const [classmates] = await connection.execute(
                    'SELECT id, name FROM USER WHERE class = ?',
                    [class_id]
                );
                await connection.end();


                const classmate_info = classmates.map(({ id, name }) => ({ id, name }));


                const { name, language, teacher_id } = rows[0];


                const parsed_teacher_id = JSON.parse(teacher_id);


                console.log("ID professors: ", parsed_teacher_id);


                const teacher_info = await Promise.all(parsed_teacher_id.map(async (id) => {
                    const connection = await createConnection();
                    const [teacher] = await connection.execute(
                        'SELECT name FROM USER WHERE id = ?',
                        [id]
                    );
                    await connection.end();

                    console.log("Teacher info after SELECT: ", teacher[0]);

                    return { id, name: teacher[0].name };
                }));



                console.log(language);
                const language_info = JSON.parse(language);

                console.log(language_info);

                const messages = await Message.find({ userId: user_id });

                const messagesByLanguage = language_info.map(language => {

                    const messagesfiltered = messages.filter(message => message.languageId === language.id);

                    return {
                        ...language,
                        messages: messagesfiltered
                    }
                    
                });

                resolve({ class_id, name, language_info: messagesByLanguage, teacher_info, classmate_info,  });

            }
        } catch (error) {
            reject(error);
        }
    });
}