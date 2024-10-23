import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";


export default function AddItemModal(props) {
  const { setShowAddItemModal, getInventoryItems } = props;
  const user = useSelector((state) => state.user.user);

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [formData, setFormData] = React.useState({
    itemName: "",
    itemType: "",
    image: null,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleAddItem = async () => {
    const fData = new FormData();

    // Append the image file (assuming 'imageFile' is a File object)
    fData.append("image", imageFile);

    // Append any additional data (assuming 'data' is an object)
    Object.keys(formData).forEach((key) => {
      fData.append(key, formData[key]);
    });

    try {
      const url = `${BASE_URL}/api/inventory/addItemGroup`;
      const res = await axios.post(`${url}/${user?.userId}`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        getInventoryItems();
      }
    } catch (err) {alert(err.message)}
  };

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
    handleAddItem();
    // setShowAddItemModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[400px] max-w-full">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
          <i className="fas fa-plus-circle text-indigo-500 mr-3"></i>
          Add New Item
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <i className="fas fa-box-open absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Item Name"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
            />
          </div>
          <div className="relative">
            <i className="fas fa-tag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Item Type"
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="itemType"
              value={formData.itemType}
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
          {/* <div className="relative">
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
          </div> */}
          <div className="relative">
            <i className="fas fa-image absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              name="image"
            />
          </div>
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected item"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
