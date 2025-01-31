const URL = process.env.NEXT_PUBLIC_URL;

export async function chargeMessage(userId) {
    try {
        const response = await fetch(`${URL}/messages?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar los mensajes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar los mensajes:", error);
        throw error;
    }
}


export async function sendMessage(body) {
    console.log("New Message", body)
    try {
        console.log("mensaje a: ",URL)
        const response = await fetch(`${URL}/message/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: body.text })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error ${response.status}: ${errorResponse.description || 'Invalid request'}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Fetch error", error);
        throw error;
    }
}

