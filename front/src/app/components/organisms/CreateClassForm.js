"use client";

import React, { useState } from "react";
import { createClass } from "../../../services/communicationManager"; // Import createClass function
import BaseForm from "../molecules/BaseForm"
import { useRouter } from 'next/navigation';

const CreateClassForm = ({ }) => {
    const router = useRouter();
    const [className, setClassName] = useState(""); // Add state for class name
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const topText = "Crea una nova Classe"


    const handleCreate = async () => {
        if (className) {
            try {
                console.log("Attempting to create class...");
                const response = await createClass(className);
                console.log("Create class response:", response);
                if (response) {
                        router.push('/PfPage');
                } else {
                    alert("Failed to create class. Please check your details.");
                }
            } catch (error) {
                console.error("Error creating class:", error);
                alert("An error occurred while creating the class.");
            }
        } else {
            alert("Please enter all required fields.");
        }
    };

    

    return (
        <div className="flex-1 flex">
            <BaseForm topText={topText} sendButtonText={"Create Class"} onSendButtonClick={handleCreate} formValues={
                [
                    { placeholder: "Class Name", text: className, handleOnChange: (e) => setClassName(e.target.value) },
                ]
            } />
        </div>
    )
};

export default CreateClassForm;