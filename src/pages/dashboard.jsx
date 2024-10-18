"use client";
import React, { useState } from "react";
import InventoryTable from "@/components/auth/inventory-table";
import AuthGuard from "@/components/auth/auth-guard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { setItems } from "@/store/slices/itemsSlice";
import axios from "axios";
import LoadingIndicator from "@/components/auth/hocs/LoadingIndicator";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("inventory");
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  console.log("use data in redux", user);

  const getInventoryItems = async () => {
    const url = "http://localhost:5000/api/inventory/getInventoryItems";
    console.log("fetching inventory");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setItems(res.data.result));
    } catch (err) {}
    setLoading(false);
  };

  const DashboardLink = ({ title, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(title.toLowerCase())}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
        isActive
          ? "bg-indigo-900 text-indigo-300"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <i className={`fas ${icon} text-lg`}></i>
      <span className="font-medium">{title}</span>
    </button>
  );

  const AddItemModal = () => {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [formData, setFormData] = React.useState({
      itemName: "",
      itemType: "",
      quantity: "",
      purchaseDate: "",
      warrantyExpiry: "",
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
        const url = "http://localhost:5000/api/inventory/addItem";
        const res = await axios.post(`${url}/${user?.userId}`, fData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.success) {
          getInventoryItems();
        }
      } catch (err) {}
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
            <div className="relative">
              <i className="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="number"
                placeholder="Quantity"
                className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
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
  };

  const UserMenu = (props) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        router.push("authentication");
        dispatch(setUser(null));
        localStorage.setItem("user", null);
        localStorage.setItem("token", null);
        setIsLoggingOut(false);
      }, 2000);
    };
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <i className="fas fa-user-circle text-2xl"></i>
          <span>{user?.username}</span>
          <i className={`fas fa-chevron-${showUserMenu ? "up" : "down"}`}></i>
        </button>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              onClick={() => handleLogout()}
            >
              {isLoggingOut ? (
                <div className="w-full flex justify-between items-center">
                  <p>Goodbye...</p>
                  <LoadingIndicator height="30%" width={"30%"} />
                </div>
              ) : (
                <p>Logout</p>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const ContentArea = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 capitalize">
        {activeTab}
      </h2>
      {activeTab === "inventory" ? (
        <InventoryTable
          {...{ setShowAddItemModal, user, getInventoryItems, loading }}
        />
      ) : (
        <p className="text-gray-400">
          This is the {activeTab} section of your dashboard.
        </p>
      )}
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-100 h-[60vh]">
        <div className="flex">
          <nav className="bg-gray-800 w-64 h-screen p-5 shadow-sm">
            <h1 className="text-2xl font-bold text-indigo-400 mb-8">
              Dashboard
            </h1>
            <div className="space-y-2">
              <DashboardLink
                title="Inventory"
                icon="fa-boxes"
                isActive={activeTab === "inventory"}
              />
              <DashboardLink
                title="Stats"
                icon="fa-chart-bar"
                isActive={activeTab === "stats"}
              />
              <DashboardLink
                title="Reports"
                icon="fa-file-alt"
                isActive={activeTab === "reports"}
              />
            </div>
          </nav>
          <main className="flex-grow p-8">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-200">
                  Welcome back!
                </h2>
                <p className="text-gray-400">
                  Here's what's happening with your business today.
                </p>
              </div>
              <UserMenu />
            </header>
            <ContentArea />
          </main>
        </div>
        {showAddItemModal && <AddItemModal />}
      </div>
    </AuthGuard>
  );
}

export default MainComponent;
