import React, { useState, useEffect } from "react";
import LoadingIndicator from "../hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AddItemModal from "./add-item-modal";

export default function InventoryTable(props) {
  const { items, getInventoryItems } = props;
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const handleViewItemGroup = (id) => {
    router.push(`inventory/${id}`);
  };

  console.log("items", items);

  const getImageUrl = (imgFile) => {
    const bufferData = imgFile.buffer;

    const byteCharacters = atob(bufferData);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const imageBlob = new Blob([byteArray], { type: imgFile.mimetype });

    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log(items);

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between mb-4 items-center">
        <h3 className="text-xl font-semibold text-gray-200">Inventory Items</h3>
        <button
          onClick={() => setShowAddItemModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-100 mx-5"
        >
          <i className="fas fa-plus-circle"></i>
          <span>Add Item</span>
        </button>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-lg w-[100%]">
          <i className="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
          <p className="text-xl font-semibold text-gray-300 mb-2">
            No items available
          </p>
          <p className="text-gray-400 text-center max-w-md">
            Your inventory is empty. Click the "Add Item" button to start adding
            items to your inventory.
          </p>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Your First Item</span>
          </button>
        </div>
      ) : (
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700 rounded-tl-lg">
                Image
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Item Name
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Type
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Quantity
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-gray-700"
                onClick={() => handleViewItemGroup(item.id)}
              >
                <td className="p-4 border-b border-gray-600">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.name}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.type}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.quantity}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  <button>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-end">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 flex items-center"
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Prev
          </button>
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`px-3 py-2 border border-gray-700 bg-gray-800 text-sm font-medium ${
                currentPage === number + 1
                  ? "text-indigo-500 bg-gray-700"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 flex items-center"
          >
            Next
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </div>
      {showAddItemModal && (
        <AddItemModal {...{ setShowAddItemModal, getInventoryItems }} />
      )}
    </div>
  );
}
