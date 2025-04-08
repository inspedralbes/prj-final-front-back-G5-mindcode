import React from "react";

const Class = ({name, gmail}) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-96">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    Configuración del Usuario
                </h2>
            <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Nombre:</strong> {name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {gmail}
                </p>
            </div>
            </div>
        </div>
    );
}

export default Class;