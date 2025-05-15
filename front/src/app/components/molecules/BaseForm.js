"use client";

import React from "react";
import FormTextInput from "../atoms/FormTextInput";


const BaseForm = ({ topText, sendButtonText, onSendButtonClick, formValues }) => {
    return (
        <div className="w-full p-6 flex ">
            <div className="flex justify-evenly flex-col w-full">
                <div className="text-white text-center w-full text-3xl">
                    {topText}
                </div>
                <div className="w-full">
                    <div className="flex flex-col items-center gap-4">
                        {formValues.map((form, index) =>
                            <FormTextInput
                                key={index}
                                placeholder={form.placeholder}
                                text={form.text}
                                handleOnChange={form.handleOnChange}
                            />
                        )}
                        <button
                            className="w-40 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-500 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                            onClick={onSendButtonClick}
                        >
                            {sendButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default BaseForm;