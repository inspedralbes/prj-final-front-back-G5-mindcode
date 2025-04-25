import React from "react";
import Button from "app/components/atoms/Button";

const ClassSettings = ({ name, teacher, classMates, onLeaveClass, isStudent = true, onKickUser }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-md mx-auto transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {name}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Professor/a</h4>
          <div className="ml-1">
            {Array.isArray(teacher) ? (
              teacher.map((prof, index) => (
                <p key={index} className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {prof}
                </p>
              ))
            ) : (
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {teacher}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Alumnes</h4>
          <div className="ml-1 space-y-2">
            {classMates.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                {!isStudent && (
                  <Button
                    text="Eliminar"
                    className="px-3 py-1 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                    onClick={() => onKickUser(user)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isStudent && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="flex justify-center">
            <Button
              text="Sortir de la classe"
              className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={onLeaveClass}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSettings;