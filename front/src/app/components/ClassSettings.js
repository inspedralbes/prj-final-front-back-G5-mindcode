import React from "react";

const ClassSettings = ({name, users}) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-96">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    <strong>Nom de la classe:</strong> {name}
                </h2>
            <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                    {users.map((user, index) => (
                <span key={index}>
                    {user} <br />
                </span>
    ))}
                </p>
            </div>
            </div>
        </div>
    );
}

export default ClassSettings;