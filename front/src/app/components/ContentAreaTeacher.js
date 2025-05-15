import React from "react";

const ContentArea = ({ students }) => {
  return (
    <div className="w-4/4 h-full p-6">
      <div className="h-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-600 rounded-md">
        <h3 className="text-lg font-semibold">Lista de Alumnos:</h3>
        <ul className="mt-4">
          {students.length > 0 ? (
            students.map((student, index) => (
              <li key={index} className="text-sm text-gray-800 dark:text-gray-200">
                {student.name} - {student.gmail}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay estudiantes disponibles.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContentArea;
