"use client";

import React, { useState } from "react";
import { joinClass } from "../../../services/communicationManager";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import Title from "app/components/atoms/Title";
import Input from "app/components/atoms/Input";
import Button from "app/components/atoms/Button";
import PanelBox from "app/components/atoms/PanelBox";
import Panel from "app/components/atoms/Panel";

const JoinClassForm = () => {
  const userInfo = useAuthStore.getState();
  const router = useRouter();
  const [classCode, setClassCode] = useState("");

  const handleJoin = async () => {
    if (classCode) {
      try {
        const response = await joinClass(classCode);
        if (response.class_info) {
          router.push(userInfo.role == 1 ? '/PfPage' : '/StPage');
        } else {
          alert("Failed to join class. Please check your details.");
        }
      } catch (error) {
        console.error("Error joining class:", error);
        alert("An error occurred while joining the class.");
      }
    } else {
      alert("Please enter the class code.");
    }
  };

  return (
    <Panel>
      <PanelBox>
      <h5 className="text-white text-1xl font-bold mb-6 text-center">
      <Title>Uneix-te a una classe existent</Title>
      </h5>
      <Input
      placeholder="Class Code"
      value={classCode}
      onChange={(e) => setClassCode(e.target.value)}
      />
      <Button onClick={handleJoin}>Join Class</Button>
      </PanelBox>
    </Panel>
  );
};

export default JoinClassForm;
