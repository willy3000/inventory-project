import Layout from "@/pages/dashboard";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import { copyTextToClipboard } from "@/utils/constants";
import { toast } from "react-toastify";

export default function UserDetails() {
  const router = useRouter();
  const operatorId = router.query.userId;
  const user = useSelector((state) => state.user.user);
  const [inventoryOperator, setInventoryOperator] = useState(null);
  const [loading, setLoading] = useState(false);

  const getInventoryOperatorById = async () => {
    const url = `${BASE_URL}/api/operators/getInventoryOperatorById`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${operatorId}`
      );
      setInventoryOperator(res.data.result);
      setEditedUser(res.data.result);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInventoryOperatorById();
  }, []);

  const [isEditing, setIsEditing] = React.useState(false);
  const [generatingPassword, setGeneratingPassword] = React.useState(false);

  const [editedUser, setEditedUser] = React.useState({ ...inventoryOperator });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = React.useRef();
  const getStatusColor = (status) => {
    return status ? "text-green-500" : "text-red-500";
  };

  const handleEditToggle = () => {
    setSelectedImage(null);
    if (isEditing) {
      setEditedUser({ ...inventoryOperator });
    }
    setIsEditing(!isEditing);
  };
  const handleSaveChanges = async () => {
    console.log("edited user = ", editedUser);
    const fData = new FormData();

    // Append the image file (assuming 'imageFile' is a File object)
    fData.append("image", selectedImage);

    // Append any additional data (assuming 'data' is an object)
    fData.append("operatorDetails", JSON.stringify(editedUser));

    try {
      const url = `${BASE_URL}/api/operators/updateOperator`;
      const res = await axiosInstance.put(
        `${url}/${user?.userId}/${operatorId}`,
        fData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        getInventoryOperatorById();
        toast.success("User Updated");
        setSelectedImage(null);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };
  const handlePermissionToggle = (permission) => {
    setEditedUser({
      ...editedUser,
      permissions: {
        ...editedUser.permissions,
        [permission]: !editedUser.permissions[permission],
      },
    });
  };
  const handleStatusToggle = () => {
    const newStatus = editedUser.disabled ? false : true;
    setEditedUser({
      ...editedUser,
      disabled: newStatus,
    });
  };
  const generatePassword = () => {
    setGeneratingPassword(true);
    setTimeout(async () => {
      try {
        const url = `${BASE_URL}/api/operators/generateNewPassword`;
        const res = await axiosInstance.put(
          `${url}/${user?.userId}/${operatorId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          getInventoryOperatorById();
          toast.success("Password Updated");
        }
      } catch (err) {
        toast.error(err.message);
      }
      setGeneratingPassword(false);
    }, 2000);
    // setEditedUser({ ...editedUser, password });
  };

  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const copyToClipboard = (text) => {
    copyTextToClipboard(text);
    setToastMessage("Copied to clipboard!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  const [showPassword, setShowPassword] = React.useState(false);

  const getImageUrl = (imgFile) => {
    if (imgFile) {
      try {
        const bufferData = imgFile?.buffer;

        const byteCharacters = atob(bufferData);

        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const imageBlob = new Blob([byteArray], { type: imgFile.mimetype });

        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
      } catch (err) {
        const url = URL.createObjectURL(imgFile);
        return url;
      }
    }

    return null;
  };


  return (
    <div>
      {showToast && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/50 backdrop-blur-lg text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 z-50"
          style={{ animation: "fadeOut 2s forwards" }}
        >
          {toastMessage}
        </div>
      )}
      <div>
        <div className="overflow-y-scroll max-h-[70vh] p-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold">User Details</h2>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-[#4F46E5] rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <i
                    className={`fas ${isEditing ? "fa-times" : "fa-edit"}`}
                  ></i>
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-green-500/80 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <i className="fas fa-save"></i>
                    <span>Save</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-6 bg-gray-700/30 p-4 rounded-xl">
              {isEditing ? (
                <div className="space-y-3 flex-1">
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="text"
                      name="username"
                      value={editedUser?.username}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 pl-10 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-400 outline-none transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="text"
                      name="email"
                      value={editedUser?.email}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 pl-10 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-400 outline-none transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedImage(file);
                        }
                      }}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          !selectedImage
                            ? editedUser?.image
                              ? getImageUrl(editedUser?.image)
                              : "/images/user-placeholder.webp"
                            : getImageUrl(selectedImage)
                        }
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                      />
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-gray-700/30 rounded-lg hover:bg-gray-600 transition-all duration-200 text-white flex items-center space-x-2"
                      >
                        <i className="fas fa-camera"></i>
                        <span>Choose Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        inventoryOperator?.image
                          ? getImageUrl(inventoryOperator?.image)
                          : "/images/user-placeholder.webp"
                      }
                      alt={`${inventoryOperator?.userName}'s profile`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {inventoryOperator?.username}
                      </h3>
                      <p className="text-gray-400 mt-2">
                        {inventoryOperator?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <i className="fas fa-shield-alt text-[#4F46E5]"></i>
                <span>Account Status</span>
              </h3>
              {isEditing ? (
                <button
                  onClick={handleStatusToggle}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    editedUser?.disabled
                      ? "bg-green-500/80 hover:bg-green-600"
                      : "bg-red-500/80 hover:bg-red-600"
                  }`}
                  style={{
                    animation: `${
                      editedUser?.disabled
                        ? "activateButton"
                        : "deactivateButton"
                    } 0.3s ease-in-out`,
                  }}
                >
                  <i
                    className={`fas ${
                      !editedUser?.disabled ? "fa-user-slash" : "fa-user-check"
                    }`}
                  ></i>
                  <span>
                    {!editedUser?.disabled ? "Deactivate" : "Activate"} Account
                  </span>
                </button>
              ) : (
                <span
                  className={`${getStatusColor(
                    !inventoryOperator?.disabled
                  )} flex items-center space-x-2`}
                >
                  <i
                    className={`fas ${
                      !inventoryOperator?.disabled
                        ? "fa-check-circle"
                        : "fa-times-circle"
                    }`}
                  ></i>
                  <span className="capitalize">
                    {!inventoryOperator?.disabled ? "active" : "inactive"}
                  </span>
                </span>
              )}
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <i className="fas fa-lock text-[#4F46E5]"></i>
                <span>Permissions</span>
              </h3>
              <div className="grid gap-4">
                {Object.entries(inventoryOperator?.permissions || []).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                        value ? "bg-green-500/20" : "bg-gray-700/30"
                      }`}
                    >
                      <span className="capitalize flex items-center space-x-3">
                        <i
                          className={`fas ${
                            key.includes("EditInventory")
                              ? "fa-boxes"
                              : key.includes("EditEmployees")
                              ? "fa-users-cog"
                              : "fa-hand-holding-box"
                          } ${
                            value ? "text-green-400" : "text-gray-400"
                          } text-lg`}
                        ></i>
                        <span
                          className={`font-medium ${
                            value ? "text-green-400" : "text-gray-300"
                          }`}
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      </span>
                      {isEditing ? (
                        <button
                          onClick={() => handlePermissionToggle(key)}
                          className="relative w-16 h-8 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor: editedUser?.permissions[key]
                              ? "rgb(34, 197, 94)"
                              : "rgb(75, 85, 99)",
                          }}
                        >
                          <div
                            className="absolute w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 top-1"
                            style={{
                              transform: `translateX(${
                                editedUser?.permissions[key] ? "32px" : "4px"
                              })`,
                            }}
                          ></div>
                        </button>
                      ) : (
                        <span
                          className={`flex items-center space-x-2 ${
                            value ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          <span className="font-medium">
                            {value ? "Enabled" : "Disabled"}
                          </span>
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <i className="fas fa-key text-[#4F46E5]"></i>
                <span>Login Details</span>
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <i className="fas fa-id-badge text-gray-400"></i>
                    <span>User Code</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>{inventoryOperator?.userCode}</span>
                    <button
                      onClick={() =>
                        copyToClipboard(inventoryOperator?.userCode)
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <i className="fas fa-lock text-gray-400"></i>
                    <span>Password</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>
                      {isEditing
                        ? editedUser?.password
                        : showPassword
                        ? inventoryOperator?.password
                        : "••••••••••"}
                    </span>
                    <button
                      onClick={generatePassword}
                      className="text-yellow-400 hover:text-yellow-300 relative group"
                    >
                      <i
                        className={`fas fa-sync-alt ${
                          generatingPassword ? "animate-spin" : ""
                        }`}
                      ></i>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Generate new password
                      </span>
                    </button>
                    <button
                      onMouseEnter={() => setShowPassword(true)}
                      onMouseLeave={() => setShowPassword(false)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(inventoryOperator?.password)
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes toggleOn {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes toggleOff {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes activateButton {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes deactivateButton {
          0% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-5px);
          }
          75% {
            transform: translateY(5px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

UserDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
