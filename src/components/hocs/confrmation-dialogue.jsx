import React from "react";

export default function ConfirmModal(props) {
  const { handleConfirm, onCancel } = props;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 shadow-lg w-[30%] max-w-full rounded-xl">
        <div className="text-center mb-6">
          <div
            className="inline-block p-3 bg-yellow-600 mb-4 w-20"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          >
            <i className="fas fa-exclamation-triangle text-3xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-200">Confirm Action</h3>
          <p className="text-gray-400 mt-2">
            Are you sure you want to proceed with this action?
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <i className="fas fa-check mr-2"></i>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
