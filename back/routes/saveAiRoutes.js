const Conversaciones = require('./models/Conversaciones'); 



app.post('/message/create', verifyTokenMiddleware, async (req, res) => {
    const { message, language_id, class_id } = req.body;
    const verified_user_id = req.verified_user_id;
    let connection;

    
    if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "El mensaje es obligatorio y no puede estar vacío." });
    }

    if (!language_id || typeof language_id !== 'number') {
        return res.status(400).json({ error: 'El ID de idioma es obligatorio y debe ser un número.' });
    }

    if (!class_id || typeof class_id !== 'number') {
        return res.status(400).json({ error: 'El ID de clase es obligatorio y debe ser un número.' });
    }

    if (!verified_user_id || typeof verified_user_id !== 'number') {
        return res.status(400).json({ error: 'El ID de usuario verificado es obligatorio y debe ser un número.' });
    }




    try {
        connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM USER WHERE id = ? AND class = ?',
            [verified_user_id, class_id]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'No perteneces a esta clase.' });
        }
    } catch (error) {
        console.error('Error al verificar clase:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    } finally {
        if (connection) connection.end();
    }



    let language;
    try {
        connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT language FROM CLASS WHERE idclass = ?',
            [class_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        language = rows[0].language;
    } catch (error) {
        console.error('Error obteniendo el lenguaje:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    } finally {
        if (connection) connection.end();
    }

    const parsedLanguages = JSON.parse(language);
    const languageToSend = parsedLanguages.find(l => l.id === language_id);
    if (!languageToSend) {
        return res.status(400).json({ error: 'El lenguaje no coincide con la clase.' });
    }



    let restriction;
    try {
        connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT content FROM RESTRICTION WHERE idrestriction = ?',
            [languageToSend.restrictionId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restricción no encontrada' });
        }
        restriction = rows[0].content;
    } catch (error) {
        console.error('Error obteniendo restricción:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    } finally {
        if (connection) connection.end();
    }




    try {
        const aiResponse = await sendToAI(message, languageToSend.name, restriction);
        const returnMessage = aiResponse.content;

        const thinkTagContent = returnMessage.match(/<think>(.*?)<\/think>/s);

        let mensajeIA = returnMessage;
        let pensamientoIA = "No hay pensamiento";

        if (thinkTagContent && thinkTagContent[1]) {
            pensamientoIA = thinkTagContent[1];
            mensajeIA = returnMessage.replace(thinkTagContent[0], "").trim();
        }

        const nuevoMensaje = new Conversaciones({
            usuario: verified_user_id,
            mensaje: message,
            mensajeIA,
            pensamientoIA,
            fecha: new Date()
        });

        await nuevoMensaje.save();

        res.status(200).json({ mensajeIA, pensamientoIA });

    } catch (error) {
        console.error("Error al procesar el mensaje con la IA:", error);
        res.status(500).json({ error: 'Error al procesar el mensaje. Inténtalo de nuevo.' });
    }
});