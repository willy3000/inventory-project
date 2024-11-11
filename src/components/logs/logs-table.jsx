import React, { useState, useEffect } from "react";
import LoadingIndicator from "../hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import EmployeeSelectModal from "../employees/employee-select-modal";
import axios from "axios";
import { setEmployees } from "@/store/slices/employeesSlice";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "../hocs/axiosInstance";
import { toast } from "react-toastify";

export default function LogsTable(props) {
  const {
    items,
    getGroupItems,
    itemGroup,
    user,
    pageDetails,
    totalItems,
    setPageDetails,
  } = props;
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const [showEmployeeSelectModal, setEmployeeSelectModal] =
    React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const employees = useSelector((state) => state.employees.employees);
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);

  const handleViewItemDetails = (id) => {
    router.push(`${router.asPath}/${id}`);
  };

  const getEmployees = async () => {
    const url = `${BASE_URL}/api/employees/getEmployees`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setEmployees(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  const getPlaceholderImage = (gender) => {
    if (gender === "FEMALE") {
      return "/images/female-employee.png";
    }
    return "/images/male-employee.jpeg";
  };

  const getImageUrl = (imgFile) => {
    if (imgFile) {
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
    }
  };

  const totalPages = Math.ceil(totalItems / pageDetails.limit);
  const paginate = (pageNumber) =>
    setPageDetails({ ...pageDetails, page: pageNumber });

  const handleEmployeeSelect = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setEmployeeSelectModal(true);
  };

  const downloadExcel = async () => {
    const url = `${BASE_URL}/api/logs/exportLogs`;
    try {
      const response = await axiosInstance.get(`${url}/${user?.userId}`, {
        responseType: "blob", // Important to handle binary data
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      // Create a URL for the blob and download it
      const bloburl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = bloburl;
      a.download = "inventory.xlsx"; // Set the desired file name here
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      bloburl;
    } catch (err) {
      toast.error("Error downloading file:", err.message);
    }
  };

  const getAssignedEmployee = (employeeId) => {
    const employee = employees.find((employee) => employee.id === employeeId);

    if (!employee) {
      return null;
    }

    return (
      <div className="flex items-center bg-gray-600 rounded-full p-2 max-w-fit">
        <img
          src={
            employee?.image
              ? getImageUrl(employee?.image)
              : getPlaceholderImage(employee?.gender)
          }
          alt={`${employee?.name}`}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-s truncate max-w-[100px]">
          {employee?.employeeName}
        </span>
      </div>
    );
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-200">{"Logs"}</h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-indigo-500/30"
          >
            <i className="fas fa-download"></i>
            <span>Download Logs</span>
            <i
              className={`fas fa-chevron-${
                showDownloadMenu ? "up" : "down"
              } ml-2 transition-transform duration-200`}
            ></i>
          </button>
          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-1 z-10 border border-gray-700 animate-fadeIn">
              <button
                onClick={() => {
                  downloadExcel();
                  //   downloadLogs("xlsx");
                  setShowDownloadMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-file-excel"></i>
                <span>CSV (.csv)</span>
              </button>
              <button
                onClick={() => {
                  downloadLogs("pdf");
                  setShowDownloadMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-file-pdf"></i>
                <span>PDF (.pdf)</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-lg w-[100%]">
          <i className="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
          <p className="text-xl font-semibold text-gray-300 mb-2">
            No items available
          </p>
          <p className="text-gray-400 text-center max-w-md">
            {
              'Your inventory is empty. Click the "Add Item" button to start adding items to your inventory.'
            }
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
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                User Code
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Username
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Operation
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Role
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Status
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Time Stamp
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-gray-700"
                onClick={() => handleViewItemDetails(item.id)}
              >
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.userCode}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.username}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.operation}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.role}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.status}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {`${new Date(item?.timestamp)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-end">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(pageDetails.page - 1)}
            disabled={pageDetails.page === 1}
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
                pageDetails.page === number + 1
                  ? "text-indigo-500 bg-gray-700"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(pageDetails.page + 1)}
            disabled={pageDetails.page === totalPages}
            className="px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 flex items-center"
          >
            Next
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </div>
      {showEmployeeSelectModal && (
        <EmployeeSelectModal
          {...{
            setEmployeeSelectModal,
            user,
            item: selectedItem,
            getGroupItems,
          }}
        />
      )}
    </div>
  );
}
