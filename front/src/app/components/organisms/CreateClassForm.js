"use client";

import React, { useState } from "react";
import { createClass } from "../../../services/communicationManager";
import { useRouter } from 'next/navigation';
import PanelBox from "app/components/atoms/PanelBox";
import Panel from "app/components/atoms/Panel";
import Button from "../atoms/Button";
import Title from "../atoms/Title";
import Input from "../atoms/Input"; 

const CreateClassForm = () => {
  const router = useRouter();
  const [className, setClassName] = useState("");

  const handleCreate = async () => {
    if (className) {
      try {
        const response = await createClass(className);
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
      alert("Please enter the class name.");
    }
  };

  return (
    <Panel>
      <PanelBox>
        <Title>Crear una nova classe</Title>

        <Input
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <Button onClick={handleCreate}>Create Class</Button>
      </PanelBox>
    </Panel>
  );
};

export default CreateClassForm;
