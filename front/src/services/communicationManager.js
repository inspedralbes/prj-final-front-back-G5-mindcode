import { useAuthStore } from "../stores/authStore"

const URL = process.env.NEXT_PUBLIC_URL;

const user_info = useAuthStore.getState().user_info
const class_info = useAuthStore.getState().class_info

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
        console.log("setting class info with this info: ", data.class_info);
        useAuthStore.getState().setClass(data.class_info);
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

    const user = useAuthStore.getState().user_info

    const response = await fetch(`${URL}/api/class`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
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

export async function getClass(class_id) {
  try {
    const url = `${URL}/api/class`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Error getting class data: ${await response.text()}`);

    return await response.json();
  } catch (error) {
    console.error("Error in getClass:", error);
    throw error;
  }
}

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
  const user_info = useAuthStore.getState().user_info

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
//     const response = await fetch(`${URL}/api/user?class_id=${class_id}`);  
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

// LANGUAGES
export async function getLanguages() {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token available, user not authenticated.");
    }

    const response = await fetch(`${URL}/api/language`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user_info.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting data from language: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en Communication Manager:", error);
    throw error;
  }
}

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

export async function addLanguageToClass(classId, language) {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    console.log("language", language);


    if (!classId || !language || !language.id || !language.name || !language.restrictionId) {

      console.log("classId", classId);
      console.log("language", language);
      console.log("language.id", language.id ? language.id : "No id");
      console.log("language.name", language.name);
      console.log("language.restrictionId", language.restrictionId);
      throw new Error("Class ID and valid language details are required");
    }

    console.log(`Adding language to class: ${language.name} (ID: ${language.id}, Restriction: ${language.restrictionId})`);

    const response = await fetch(`${URL}/api/language/class/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ classId, language }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error adding language to class: ${errorText}`);
    }

    return await response.json();
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

export async function deleteLanguageFromClass(classId, languageId) {
  try {
    if (!classId || !languageId) {
      throw new Error("Class ID and Language ID are required");
    }

    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(
      `${URL}/api/language/class?classId=${classId}&languageId=${languageId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user_info.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting language from class: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
}

export async function fetchAiMessagesClassData(classId) {

  const user_info = useAuthStore.getState().user_info;

  const response = await fetch(`${URL}/api/stats/${classId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  })

  if (!response.ok) {
    throw new Error('Error al cargar los mensajes');
  }

  const data = await response.json();

  // console.log("Data from fetchAiMessagesClassData:", data);
  return data;
}

export async function fetchAiMessagesStudentData(studentId) {

  const user_info = useAuthStore.getState().user_info;

  const response = await fetch(`${URL}/api/stats/student/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  })

  if (!response.ok) {
    throw new Error('Error al cargar los mensajes');
  }

  const data = await response.json();

  // console.log("Data from fetchAiMessagesClassData:", data);
  return data;
}

export async function fetchQuizzesClassData(classId) {

  const user_info = useAuthStore.getState().user_info;

  const response = await fetch(`${URL}/api/stats/quizz/${classId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  })

  if (!response.ok) {
    throw new Error('Error al cargar los mensajes');
  }

  const data = await response.json();

  // console.log("Data from fetchQuizzesClassData:", data);
  return data;
}

export async function fetchQuizzesStudentData(studentId) {

  const user_info = useAuthStore.getState().user_info;

  const response = await fetch(`${URL}/api/stats/quizz/student/${studentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  })

  if (!response.ok) {
    throw new Error('Error al cargar los mensajes');
  }

  const data = await response.json();

  // console.log("Data from fetchQuizzesStudentData:", data);
  return data;
}

export async function getClassMain() {
  const user_info = useAuthStore.getState().user_info;
  console.log("GETTING CLASS INFO");
  const response = await fetch(`${URL}/api/class/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${user_info.token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Error al cargar la clase');
  }
  const data = await response.json();

  // console.log("Data recieved: ", data);

  if (data && data.class_info) {
    useAuthStore.getState().setClass(data.class_info);
    console.log("Class details saved in store:", data.class_info);
  }
  return data;
}

export async function getRestrictions() {
  try {
    const user_info = useAuthStore.getState().user_info;
    const response = await fetch(`${URL}/api/restriction`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting restrictions: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
};
export async function getUserInfo() {
  try {
    const user_info = useAuthStore.getState().user_info;
    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${URL}/api/user/${user_info.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting user info: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in Communication Manager:", error);
    throw error;
  }
}
export async function generateQuiz(classId) {
  try {
    const user_info = useAuthStore.getState().user_info;
    if (!user_info || !user_info.token) {
      throw new Error('No token provided. User not authenticated.');
    }
    const response = await fetch(`${URL}/message/api/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.token}`
      },
      body: JSON.stringify({
        class_id: classId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error || errorData.message || 'Invalid request'}`);
    }

    const data = await response.json();
    console.log('Quiz recived:', data);

    if (!data.quiz || !Array.isArray(data.quiz)) {
      throw new Error('Quiz format is invalid');
    }

  
    const quizId = data.quizId || data.quiz_id;
    if (!quizId) {
      throw new Error('Quiz ID is missing in the response');
    }

    return {
      quiz: data.quiz,
      quizId: quizId
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}

export async function submitQuizResults(quizId, answers) {
  try {
    const user_info = useAuthStore.getState().user_info;
    if (!user_info || !user_info.token) {
      throw new Error('No token provided. User not authenticated.');
    }
    const response = await fetch(`${URL}/message/api/quizResponse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.token}`
      },
      body: JSON.stringify({
        quizId,
        answers
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error ${response.status}: ${errorResponse.description || 'Invalid request'}`);
    }

    const data = await response.json();
    console.log('Quiz results received:', data);
    return data;
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    throw error;
  }
}
export async function updateUserInfo({ id, name, gmail }) {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ id, name, gmail }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getClassInfo() {
  try {
    const user_info = useAuthStore.getState().user_info;
    const class_info = useAuthStore.getState().class_info;
    const classId = class_info[0]?.class_id;

    const response = await fetch(`${URL}/api/class/user?class_id=${classId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.token}`
      }
    });

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error fetching users');
    }

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getClassDetails() {
  try {
    const user_info = useAuthStore.getState().user_info;
    const class_info = useAuthStore.getState().class_info;
    const classId = class_info[0]?.class_id;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const url = `${URL}/api/class?class_id=${classId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching class details: ${errorText}`);
    }

    const data = await response.json();

    if (data && data.teacher_id) {
      console.log("Teacher IDs for the class:", data.teacher_id);
    } else {
      console.warn("No teacher_id found in class details.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching class details:", error);
    throw error;
  }
}

export async function leaveClass() {
  try {
    const user_info = useAuthStore.getState().user_info;
    const class_info = useAuthStore.getState().class_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    if (!class_info || class_info.length === 0) {
      throw new Error("No class information available");
    }

    const class_id = class_info[0]?.class_id;

    const response = await fetch(`${URL}/api/class/leave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ id: user_info.userId, class_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error leaving class: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error leaving class:", error);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${URL}/api/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting user info for ID ${userId}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user info for ID ${userId}:`, error);
    throw error;
  }
}

export async function kickClass(targetUserId) {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    if (!targetUserId) {
      throw new Error("No target user ID provided");
    }

    const response = await fetch(`${URL}/api/class/leave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_info.token}`,
      },
      body: JSON.stringify({ id: targetUserId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error kicking user from class: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error kicking user from class:", error);
    throw error;
  }
}
export async function checkQuizAvailability() {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${URL}/message/check-quiz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_info.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Error checking quiz availability');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking quiz availability:', error);
    throw error;
  }
}


export async function getUserImage(userId) {
  try {
    const user_info = useAuthStore.getState().user_info;

    if (!user_info || !user_info.token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${URL}/api/user/getimg/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user_info.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching user image: ${errorText}`);
    }

    const data = await response.json();
    return data.img || null;
  } catch (error) {
    console.error("Error fetching user image:", error);
    throw error;
  }
}

export async function uploadUserImage(userId, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${URL}/api/user/uploadimg/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().user_info.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error uploading image: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return `${URL}/uploads/${data.fileName}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
