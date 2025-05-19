import React, { useState } from "react";
import Button from "app/components/atoms/Button";
import Dialog from "app/components/atoms/Dialog";

const ClassSettings = ({ name, teacher, classMates, onLeaveClass, isStudent = true, onKickUser }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToKick, setUserToKick] = useState(null);

  const handleKickUser = (user) => {
    setUserToKick(user);
    setIsDialogOpen(true);
  };

  const confirmKickUser = () => {
    if (userToKick) {
      onKickUser(userToKick);
      setIsDialogOpen(false);
      setUserToKick(null);
    }
  };

  const handleLeaveClass = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl p-11 w-[450px] transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 relative">
          {name}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-y-2"></span>
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Professor/a</h4>
          <div className="ml-1">
            {Array.isArray(teacher) ? (
              teacher.map((prof, index) => (
                <p key={index} className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {prof}
                </p>
              ))
            ) : (
              <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                {teacher}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Alumnes</h4>
          <div className="ml-1 space-y-3">
            {classMates.map((user, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                {!isStudent && (
                  <Button
                    children="Eliminar"
                    className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md w-auto"
                    onClick={() => handleKickUser(user)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <div className="flex justify-center">
          {isStudent ? (
            <Button
              children="Sortir de la classe"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              onClick={onLeaveClass}
            />
          ) : (
            <Button
              children="Tancar Classe"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              onClick={onLeaveClass}
            />
          )}
        </div>
      </div>


    </div>
  );
};

export default ClassSettings;