import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-50 bg-black bg-opacity-30 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 relative min-w-[350px]">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}