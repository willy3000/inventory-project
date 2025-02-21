import React, { useEffect, useState } from "react";
import Layout from "@/pages/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import { formatDate } from "@/utils/constants";
import { toast } from "react-toastify";

export default function EmployeeDetails() {
  const [employee, setEmployee] = React.useState(null);
  const [assignedItems, setAssignedItems] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const employeeId = router.query.employeeId;
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState({
    name: employee?.employeeName,
    email: employee?.email,
    gender: employee?.gender,
    department: employee?.department,
    image: employee?.image,
  });
  const handleEditToggle = () => {
    if (isEditing) {
      setEmployee((prev) => ({
        ...prev,
        ...editedProfile,
      }));
    } else {
      setEditedProfile({
        employeeName: employee.employeeName,
        email: employee.email,
        gender: employee.gender,
        department: employee.department,
        image: employee.image,
      });
    }
    setIsEditing(!isEditing);
  };
  const handleItemChange = (id, field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      assignedItems: prev.assignedItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };
  const handleRemoveItem = (id) => {
    setEmployee((prev) => ({
      ...prev,
      assignedItems: prev.assignedItems.filter((item) => item.id !== id),
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500";
      case "under maintenance":
        return "text-yellow-500";
      case "damaged":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getEmployeeById = async () => {
    const url = `${BASE_URL}/api/employees/getEmployeeById`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${employeeId}`
      );
      setEmployee(res.data.result);
      setEditedProfile(res.data.result);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const getAssignedItems = async () => {
    const url = `${BASE_URL}/api/employees/getAssignedItems`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${employeeId}`
      );
      setAssignedItems(res.data.result);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

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
        return imgFile;
      }
    }
  };

  const getPlaceholderImage = (gender) => {
    if (gender === "FEMALE") {
      return "/images/female-employee.png";
    }
    return "/images/male-employee.jpeg";
  };

  useEffect(() => {
    getEmployeeById();
    getAssignedItems();
  }, []);

  const renderUserProfile = () => (
    <div className="bg-gray-800 p-8 rounded-lg w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
          <div className="relative group">
            <img
              src={
                editedProfile?.image
                  ? getImageUrl(editedProfile?.image)
                  : getPlaceholderImage(editedProfile?.gender)
              }
              alt="User profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-white"
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  name="image"
                />
                <i className="fas fa-camera text-white text-2xl"></i>
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditToggle}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className={`fas ${isEditing ? "fa-save" : "fa-edit"}`}></i>
              <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setEditedProfile({
                    name: employee?.employeeName,
                    email: employee?.email,
                    gender: employee?.gender,
                    department: employee?.department,
                    image: employee?.image,
                  });
                  setIsEditing(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-times"></i>
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-gray-400">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedProfile.employeeName}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg"
                />
              ) : (
                <p className="text-white text-lg">
                  <i className="fas fa-user mr-2"></i>
                  {employee?.employeeName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-gray-400">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg"
                />
              ) : (
                <p className="text-white text-lg">
                  <i className="fas fa-envelope mr-2"></i>
                  {employee?.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-gray-400">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editedProfile.gender}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-white text-lg">
                  <i className="fas fa-venus-mars mr-2"></i>
                  {employee?.gender}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-gray-400">Department</label>
              {isEditing ? (
                <select
                  name="department"
                  value={editedProfile.department}
                  onChange={handleProfileChange}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg"
                >
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Accounts">Accounts</option>
                </select>
              ) : (
                <p className="text-white text-lg">
                  <i className="fas fa-building mr-2"></i>
                  {employee?.department}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl text-white mb-4">
              <i className="fas fa-tasks mr-2"></i>Assigned Items
            </h3>
            <div className="space-y-4">
              {assignedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 relative"
                >
                  <div className="w-full md:w-2/3">
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className={`${getStatusColor(item.status)} text-sm`}>
                      <i className="fas fa-circle mr-2"></i>
                      {item.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 whitespace-nowrap">
                      <i className="fas fa-calendar mr-2"></i>Issued:{" "}
                      {formatDate(item.assignedOn)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderUserProfile()}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

EmployeeDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
