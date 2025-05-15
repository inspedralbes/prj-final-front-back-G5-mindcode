"use client";

import React, { useState } from "react";
import JoinClassForm from "../components/organisms/JoinClassForm";

const JoinClass = () => {

  return (
    <div className="min-h-screen bg-black text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex flex-row-reverse justify-center flex-1">
        <JoinClassForm />
        <div className="flex-1 bg-black text-center hidden lg:flex  max-w-[50%]">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/IA.png')`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
