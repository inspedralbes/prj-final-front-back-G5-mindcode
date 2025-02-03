const URL = process.env.NEXT_PUBLIC_URL;
  //crear classe

export async function createClass(name, teacher_id) {
    try {
      if (!name || !teacher_id) {
        throw new Error('Name and teacher_id are required');
      }
  
      const response = await fetch(`${URL}/api/class`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, teacher_id}),
    });
      console.log(response)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error getting data from classes: ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error en Communication Manager:", error);
      throw error;
    }
  };
  //get de cuando estes dentro te salga lista de todos los alumnos

  export async function getClasse(class_id) {
    try {
        if (!class_id ) {
            throw new Error('Class_id are required');
        }
      const response = await fetch(`${URL}/getClassInfo`);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Request error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Communication Manager error:", error);
      throw error;
    }
  }

    //unirse a clase

  export async function joinClass(class_code, user_id) {
    try {
        if (!class_code || !user_id) {
            throw new Error('Class_code and user_id are required');
        }

        console.log("Attempting to join class with:", { class_code, user_id });

        const response = await fetch(`${URL}/api/class/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({class_code, user_id}),
        });

        console.log("Server Response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Join class success:", data);
        return data;
    } catch (error) {
        console.error("Error in Communication Manager:", error);
        throw error;
    }
}




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

