import React from "react";
import Button from "app/components/atoms/Button";

const ClassSettings = ({ name, teacher, classMates, onLeaveClass, isStudent = true, onKickUser }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 shadow-2xl shadow-gray-600 dark:shadow-black rounded-2xl p-8 w-full max-w-md h-auto min-h-64 items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
        <strong><center>{name}</center></strong>
      </h2>
      <br />

      <div className="text-gray-700 dark:text-gray-300">
        <h4 className="font-semibold mb-2">Professor/a:</h4>
        {Array.isArray(teacher) ? (
          teacher.map((prof, index) => (
            <p key={index} className="mb-1">- {prof}</p>
          ))
        ) : (
          <p className="mb-4">- {teacher}</p>
        )}
        <br />
        <h4 className="font-semibold mb-2">Companys/es de classe:</h4>
        {classMates.map((user, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>- {user.name}</span>
            {!isStudent && (
              <Button 
                text="Eliminar" 
                className="bg-red-600 text-white px-2 py-1 text-sm rounded-md hover:bg-red-400" 
                onClick={() => onKickUser(user)}
              />
            )}
          </div>
        ))}
      </div>

      {isStudent && (
        <div className="flex justify-center mt-4">
          <Button 
            text="Sortir de la classe" 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-400" 
            onClick={onLeaveClass}
          />
        </div>
      )}
    </div>
  );
};


export default ClassSettings;