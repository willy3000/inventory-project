import Layout from "@/pages/dashboard";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "../hocs/axiosInstance";
import { toast } from "react-toastify";

export default function AddUserModal(props) {
  const { setShowAddUserModal, getInventoryOperators } = props;
  const user = useSelector((state) => state.user.user);
  const fileInputRef = useRef();

  const [isEditing, setIsEditing] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    status: "active",
    employeeNumber: "",
    password: "",
    profileImage: "/images/user-placeholder.webp",
    permissions: {
      canEditInventory: false,
      canEditEmployees: false,
      canAssignItems: false,
    },
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    const fData = new FormData();

    // Append the image file (assuming 'imageFile' is a File object)
    fData.append(
      "image",
      fileInputRef.current.files[0] ? fileInputRef.current.files[0] : null
    );

    // Append any additional data (assuming 'data' is an object)
    const updatedFormData = { ...formData, businessName: user?.businessName };
    fData.append("operatorDetails", JSON.stringify(updatedFormData));

    console.log(fData);

    try {
      const url = `${BASE_URL}/api/operators/addInventoryUser`;
      const res = await axiosInstance.post(`${url}/${user?.userId}`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        // getInventoryUsers();
        toast.success("User Added");
        getInventoryOperators();
        setFormData({
          username: "",
          email: "",
          status: "active",
          employeeNumber: "",
          password: "",
          profileImage: "/images/user-placeholder.webp",
          permissions: {
            canEditInventory: false,
            canEditEmployees: false,
            canAssignItems: false,
          },
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast(err.message);
    }
  };

  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage("Copied to clipboard!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <i className="fas fa-plus text-[#6366f1] text-xl"></i>
          <h3 className="text-xl font-bold text-white">Add New User</h3>
        </div>
        <form className="space-y-4" onSubmit={handleAddUser}>
          <div className="relative">
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full bg-gray-700/30 px-4 py-3 rounded-lg border border-gray-600 focus:border-[#6366f1] outline-none text-white"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-700/30 px-4 py-3 rounded-lg border border-gray-600 focus:border-[#6366f1] outline-none text-white"
            />
          </div>
          <div className="relative">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={(e) => {
                e.preventDefault();
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, profileImage: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex items-center space-x-4">
              <img
                src={formData.profileImage || "/images/female-employee.png"}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current.click();
                }}
                className="px-4 py-2 bg-gray-700/30 rounded-lg hover:bg-gray-600 transition-all duration-200 text-white flex items-center space-x-2"
              >
                <i className="fas fa-camera"></i>
                <span>Choose Photo</span>
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Permissions</h4>
            {Object.keys(formData.permissions).map((permission) => (
              <div
                key={permission}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                  formData.permissions[permission]
                    ? "bg-green-500/20"
                    : "bg-gray-700/30"
                }`}
              >
                <span className="capitalize flex items-center space-x-3">
                  <i
                    className={`fas ${
                      permission.includes("EditInventory")
                        ? "fa-boxes"
                        : permission.includes("EditEmployees")
                        ? "fa-users-cog"
                        : "fa-hand-holding-box"
                    } ${
                      formData.permissions[permission]
                        ? "text-green-400"
                        : "text-gray-400"
                    } text-lg`}
                  ></i>
                  <span
                    className={`font-medium ${
                      formData.permissions[permission]
                        ? "text-green-400"
                        : "text-gray-300"
                    }`}
                  >
                    {permission.replace(/([A-Z])/g, " $1")}
                  </span>
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        [permission]: !formData.permissions[permission],
                      },
                    });
                  }}
                  className="relative w-16 h-8 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: formData.permissions[permission]
                      ? "rgb(34, 197, 94)"
                      : "rgb(75, 85, 99)",
                  }}
                >
                  <div
                    className="absolute w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 top-1"
                    style={{
                      transform: `translateX(${
                        formData.permissions[permission] ? "32px" : "4px"
                      })`,
                    }}
                  ></div>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#6366f1] rounded-lg hover:bg-[#5558e6] transition-all duration-200 text-white"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddUserModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
