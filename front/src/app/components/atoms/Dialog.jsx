import React from "react";
import { XCircle, CheckCircle } from "lucide-react";

const Dialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-300 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            <XCircle className="w-5 h-5" />
            Cancel·lar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;