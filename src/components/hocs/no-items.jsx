import React from "react";
import InventoryEditGuard from "../auth/inventory-edit-guard";

export default function NoItems(props) {
  const { message, openModal, icon } = props;
  return (
    <div className="flex flex-col items-center justify-center py-12 rounded-lg w-[100%]">
      <i className={`fas ${icon} text-6xl text-gray-400 mb-4`}></i>
      <p className="text-xl font-semibold text-gray-300 mb-2">
        No Records available
      </p>
      <p className="text-gray-400 text-center max-w-md">{message}</p>
      <InventoryEditGuard>
        <button
          onClick={() => openModal(true)}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <i className="fas fa-plus-circle"></i>
          <span>Start Adding</span>
        </button>
      </InventoryEditGuard>
    </div>
  );
}
