import React, { useState, useEffect } from "react";
import LoadingIndicator from "./hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function InventoryTable(props) {
  const { setShowAddItemModal, user, getInventoryItems, loading } = props;
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);


  console.log('items', items)

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

  useEffect(() => {
    getInventoryItems();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  console.log(items);

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Inventory Items</h3>
        <button
          onClick={() => setShowAddItemModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-100 mx-5"
        >
          <i className="fas fa-plus-circle"></i>
          <span>Add Item</span>
        </button>
      </div>
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700 rounded-tl-lg">
              Image
            </th>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700">
              Item Name
            </th>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700">
              Type
            </th>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700">
              Quantity
            </th>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700">
              Purchase Date
            </th>
            <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700 rounded-tr-lg">
              Warranty Expiry
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-gray-700">
              <td className="p-4 border-b border-gray-600">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
              </td>
              <td className="p-4 text-gray-300 border-b border-gray-600">
                {item.name}
              </td>
              <td className="p-4 text-gray-300 border-b border-gray-600">
                {item.type}
              </td>
              <td className="p-4 text-gray-300 border-b border-gray-600">
                {item.quantity}
              </td>
              <td className="p-4 text-gray-300 border-b border-gray-600">
                {item.purchaseDate}
              </td>
              <td className="p-4 text-gray-300 border-b border-gray-600">
                {item.warrantyExpiry}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
