"use client";

import React from "react";

import JoinClassForm from "../components/organisms/JoinClassForm";
import CreateClassForm from "../components/organisms/CreateClassForm"

const CreateClass = () => {
  return (
    <div className="min-h-screen bg-black text-gray-900 flex justify-around">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex flex-row-reverse justify-around w-[100%] ">
        <JoinClassForm />
        <CreateClassForm />
      </div>
    </div>
  );
};

export default CreateClass;
