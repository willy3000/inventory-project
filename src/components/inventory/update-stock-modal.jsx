import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useScanDetecton from "use-scan-detection";
import LoadingIndicator from "../hocs/LoadingIndicator";
import SerialNumberInput from "./serial-number-input";

export default function UpdateStockModal(props) {
  const { setShowAddItemModal, getGroupItems, itemGroup } = props;
  const user = useSelector((state) => state.user.user);
  const [serialNumberModal, setSerialNumberModal] = useState(false);

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    serialNumber: "",
    category: null,
    purchaseDate: null,
    warrantyExpiry: null,
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSerialNumberModal(true);
    // handleUpdateStock();
    // setShowAddItemModal(false);
  };

  if (serialNumberModal) {
    return <SerialNumberInput {...{ formData, setFormData, user, itemGroup, getGroupItems, setSerialNumberModal }} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[400px] max-w-full">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
          <i className="fas fa-plus-circle text-indigo-500 mr-3"></i>
          Add Group Item
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <i className="fas fa-box-open absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Item Name"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="relative">
            <i className="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="number"
              placeholder="Quantity"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div> */}
          <div className="relative">
            <i className="fas fa-tag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Computers">Computers</option>
              <option value="Accessories">Accessories</option>
              <option value="Network Devices">Network Devices</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <div className="relative">
            <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="date"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              Purchase Date
            </span>
          </div>
          <div className="relative">
            <i className="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="date"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="warrantyExpiry"
              value={formData.warrantyExpiry}
              onChange={handleInputChange}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              Warranty Expiry Date
            </span>
          </div>
          {/* <div className="relative">
            <i className="fas fa-image absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              name="image"
            />
          </div> */}
          {/* {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected item"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )} */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddItemModal(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
            >
              <i className="fas fa-check mr-2"></i>
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
