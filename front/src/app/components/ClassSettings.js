import React from "react";
import Button from "app/components/atoms/Button"

const ClassSettings = ({name, users, onLeaveClass}) => {
    return (
            <div className="bg-gray-50 dark:bg-gray-800 shadow-2xl shadow-gray-600 dark:shadow-black rounded-2xl p-8 w-[28rem] h-[20rem] items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    <strong>Nom de la classe:</strong> 
                </h2>
                <h3><strong> {name} </strong></h3>
                <br/>
            <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                    {users.map((user, index) => (
                <span key={index}>
                   - {user} <br />
                </span>
    ))}
                </p>
                <Button text="Sortir de la classe" className="bg-red-600 text-white px-4 py-2 rounded-md center hover:bg-red-400" onClick={onLeaveClass}/>  
            </div>
            </div>
    );
}

export default ClassSettings;