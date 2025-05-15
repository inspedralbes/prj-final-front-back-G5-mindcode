import { cloneUniformsGroups } from "three/src/renderers/shaders/UniformsUtils";
import { useAuthStore } from "../stores/authStore"

const URL = process.env.NEXT_PUBLIC_URL;

const user_info = useAuthStore.getState().user_info
const class_details = useAuthStore.getState().class_details

// const setUser = useAuthStore((state) => state.setUser);
// const setClass = useAuthStore((state) => state.setClass);

export async function loginGoogle(uid, name, gmail) {
  if (!uid | !name | !gmail) {
    throw new Error('Uid,name and gmail are required');
  }
  try {
    const response = await fetch(`${URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, name, gmail })
    });

    const data = await response.json();

    if (data) {
      console.log("setting user info with this info: ", { userId: data.id, role: data.teacher, gmail: data.gmail, token: data.token, name: data.name });
      useAuthStore.getState().setUser({ userId: data.id, role: data.teacher, gmail: data.gmail, token: data.token, name: data.name });
      if (data.class_info) {
        useAuthStore.getState().setClass(data.class_info);
        console.log("Class details saved in store:", data.class_info);
      }
    }
    if (!data) {
      throw new Error("Respuesta vacía del servidor");
    }
    return {
      hasClass: data.class_info.length !== 0,
      userData: data,
    };
  } catch (error) {
    console.error("Communication Manager error:", error);
    throw error;
  }
}
export async function createClass(name) {
  try {
    if (!name) {
      throw new Error('Name is required');
    }

    const response = await fetch(`${URL}/api/class`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ name }),
    });
    console.log(response)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting data from classes: ${errorText}`);
    }

    const data = await response.json();
    console.log(data);

    if (data && data.class_info) {
      useAuthStore.getState().setClass(data.class_info);
      console.log("Class details saved in store:", data.class_info);
    }

    return data;
  } catch (error) {
    console.error("Communication Manager error:", error);
    throw error;
  }
};


export async function joinClass(class_code) {
  try {
    if (!class_code) {
      throw new Error('Class_code required');
    }

    const user_info = useAuthStore.getState().user_info;
    if (!user_info || !user_info.token) {
      throw new Error('Usuario no autenticado');
    }

    console.log("Attempting to join class with:", { class_code });

    const response = await fetch(`${URL}/api/class/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ class_code }),
    });

    console.log("Server Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Join class success:", data);

    if (data && data.class_info) {
      useAuthStore.getState().setClass(data.class_info);
      console.log("Class details saved in store:", data.class_info);
    }

    return data;
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
}

export async function getMessagesById() {
  try {
    const response = await fetch(`${URL}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user_info.token}`,
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
  console.log("User token:", user_info.token);
  console.log("New Message", body)
  try {
    console.log("mensaje a: ", URL)
    const response = await fetch(`${URL}/message/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ message: body.message, class_id: body.class_id, language_id: body.language_id })
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

// export async function getStudents(class_id) {
//   try {
//     const response = await fetch(`${URL}/api/class/user?class_id=${class_id}`);  
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     const data = await response.json();
//     return data.body;  
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     throw error;  
//   }
// }

// Languages

export async function getLanguages() {
  try {

    const response = await fetch(`${URL}/api/language`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting data from language: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en Communication Manager:", error);
    throw error;
  }
};

export const deleteLanguage = async (idlanguage) => {
  const response = await fetch(`${URL}/api/language/${idlanguage}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  })
  const data = await response.json()
  return data;
}

// Languages

export async function createLanguage(name) {
  try {
    if (!name) {
      throw new Error('Name is required');
    }

    const response = await fetch(`${URL}/api/language`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating language: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
}

export async function updateLanguages(classId, languages) {
  try {
    if (!classId || !Array.isArray(languages)) {
      throw new Error('classId and languages array are required');
    }

    const response = await fetch(`${URL}/api/language/class`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ classId, languages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error updating languages: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
}
