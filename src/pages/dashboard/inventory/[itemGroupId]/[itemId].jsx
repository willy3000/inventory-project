import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/dashboard";
import ItemGroupTable from "@/components/inventory/item-group-table";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { setGroupItems } from "@/store/slices/groupItemsSlice";
import { setEmployees } from "@/store/slices/employeesSlice";
import { BASE_URL } from "@/utils/constants";
import { formatDate } from "@/utils/constants";
import ConfirmModal from "@/components/hocs/confrmation-dialogue";
import { toast } from "react-toastify";
import axiosInstance from "@/components/hocs/axiosInstance";
import ItemAssignGuard from "@/components/auth/item-assign-guard";
import InventoryEditGuard from "@/components/auth/inventory-edit-guard";
import NotFound from "@/pages/404";

export default function ItemDetails({ item, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { itemGroupId, itemId } = router.query;
  const groupItems = useSelector((state) => state.groupItems.groupItems);
  const user = useSelector((state) => state.user.user);
  const employees = useSelector((state) => state.employees.employees);
  const [itemGroup, setItemGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState(null);
  const [showStatusList, setShowStatusList] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    purchaseDate: "",
    warrantyExpiry: "",
    assignedTo: null,
    status: "",
  });

  const getEmployees = async () => {
    const url = `${BASE_URL}/api/employees/getEmployees`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setEmployees(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  const getAssignmentHistory = async () => {
    const url = `${BASE_URL}/api/inventory/getItemAssignmentHistory`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${itemDetails?.groupId}/${itemDetails?.id}`
      );
      setAssignmentHistory(res.data.result);
    } catch (err) {
      alert(err.message);
    }
  };

  const [assignmentHistory, setAssignmentHistory] = useState([]);

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

  const getPlaceholderImage = (gender) => {
    if (gender === "FEMALE") {
      return "/images/female-employee.png";
    }
    return "/images/male-employee.jpeg";
  };

  const getItemById = async () => {
    const url = `${BASE_URL}/api/inventory/getItemById`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${itemGroupId}/${itemId}`
      );
      setItemDetails(res.data.result);
      setFormData({
        name: res.data.result.name,
        category: res.data.result.category,
        purchaseDate: res.data.result.purchaseDate,
        warrantyExpiry: res.data.result.warrantyExpiry,
        assignedTo: res.data.result.assignedTo,
        status: res.data.result.status,
      });
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = () => {};
  const handleInputChange = () => {};

  useEffect(() => {
    getItemById();
    getEmployees();
  }, []);

  useEffect(() => {
    getAssignmentHistory();
  }, [itemDetails]);

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
              ? employee?.image
              // ? getImageUrl(employee?.image)
              : getPlaceholderImage(employee?.gender)
          }
          alt={`${employee?.name}`}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-s truncate max-w-[100px]">
          {employee?.employeeName}
        </span>
        <ItemAssignGuard>
          <i
            className="fas fa-times px-2 text-gray-400 hover:cursor-pointer"
            onClick={handleUnassignItem}
          ></i>
        </ItemAssignGuard>
      </div>
    );
  };

  const getAssignmentHistoryEmployee = (employeeId) => {
    const employee = employees.find((employee) => employee.id === employeeId);

    if (!employee) {
      return null;
    }
    return employee;
  };

  const handleStatusChange = (status) => {
    setPreviousStatus(formData.status);
    setFormData({ ...formData, status: status });
    setShowStatusList(false);
    setShowConfirmationModal(true);
  };

  const updateStatus = async () => {
    try {
      const url = `${BASE_URL}/api/inventory/updateItemStatus`;
      const res = await axiosInstance.post(
        `${url}/${user?.userId}/${itemGroupId}/${itemId}`,
        { status: formData.status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success("Status updated");
        setShowConfirmationModal(false);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCanceUpdateStatus = () => {
    setFormData({ ...formData, status: previousStatus });
    setShowConfirmationModal(false);
  };

  const getStatusColor = () => {
    switch (formData.status) {
      case "active":
        return "bg-green-700";
      case "under maintenance":
        return "bg-amber-700";
      case "damaged":
        return "bg-red-800";
      default:
        return "bg-gray-600";
    }
  };

  const handleUnassignItem = async () => {
    const url = `${BASE_URL}/api/inventory/unassignItem`;
    try {
      const res = await axiosInstance.post(
        `${url}/${user?.userId}/${itemGroupId}/${itemId}/${itemDetails.assignmentId}`
      );
      getItemById();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!itemDetails) {
    return NotFound;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-200">Item Details</h3>
        <h4>{itemDetails?.name}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <i className="fas fa-box-open absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Item Name"
                className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="itemName"
                value={formData.name}
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
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="relative">
              <i className="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="date"
                className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="warrantyExpiry"
                value={formData?.purchaseDate}
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
                value={formData?.warrantyExpiry}
                onChange={handleInputChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                Warranty Expiry Date
              </span>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-around gap-5">
            <p className="text-gray-400">Current Assignment:</p>
            {itemDetails?.assignedTo ? (
              getAssignedEmployee(itemDetails.assignedTo)
            ) : (
              <ItemAssignGuard>
                <button
                  onClick={(e) => {}}
                  className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-slate-500 disabled:opacity-50 flex items-center"
                >
                  Assign
                </button>
              </ItemAssignGuard>
            )}
          </div>

          <div className="flex items-center gap-5 justify-around">
            <p className="text-gray-400">Satus:</p>
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none">
                <div
                  className={`flex items-center ${getStatusColor(
                    formData?.status
                  )} rounded-full p-2 max-w-fit gap-2`}
                >
                  <span className="text-s truncate max-w-fit">
                    {formData?.status}
                  </span>
                  <InventoryEditGuard>
                    <i
                      onClick={() => setShowStatusList(!showStatusList)}
                      className={`fas fa-chevron-${
                        showStatusList ? "up" : "down"
                      }`}
                    ></i>
                  </InventoryEditGuard>
                </div>
              </button>
              {showStatusList && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <button
                    className="block w-full text-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      handleStatusChange("active");
                    }}
                  >
                    <div className="flex items-center bg-green-700 rounded-full p-2 w-[50%] gap-2">
                      <span className="text-center font-bold truncate w-full">
                        active
                      </span>
                    </div>
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      handleStatusChange("under maintenance");
                    }}
                  >
                    <div className="flex items-center bg-amber-700 rounded-full p-2 max-w-fit gap-2">
                      <span className="text-s truncate max-w-fit">
                        under maintenance
                      </span>
                    </div>{" "}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      handleStatusChange("damaged");
                    }}
                  >
                    <div className="flex items-center bg-red-800 rounded-full p-2 max-w-fit gap-2">
                      <span className="text-s truncate max-w-[100px]">
                        damaged
                      </span>
                    </div>{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-200 mb-4">
          Assignment History
        </h4>
        <div className="overflow-y-scroll max-h-60">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-gray-200 font-semibold rounded-tl-lg">
                  Assigned To
                </th>
                <th className="p-3 text-gray-200 font-semibold rounded-tr-lg">
                  Department
                </th>
                <th className="p-3 text-gray-200 font-semibold">
                  Assigned Date
                </th>
                <th className="p-3 text-gray-200 font-semibold rounded-tr-lg">
                  Return Date
                </th>
              </tr>
            </thead>
            <tbody>
              {assignmentHistory.map((assignment) => (
                <tr key={assignment.id} className="border-b border-gray-700">
                  <td className="p-3 text-gray-300">
                    {
                      getAssignmentHistoryEmployee(assignment?.employeeId)
                        ?.employeeName
                    }
                  </td>
                  <td className="p-3 text-gray-300">
                    {
                      getAssignmentHistoryEmployee(assignment?.employeeId)
                        ?.department
                    }
                  </td>
                  <td className="p-3 text-gray-300">
                    {formatDate(new Date(assignment.assignedOn))}
                  </td>
                  <td className="p-3 text-gray-300">
                    {assignment.returnedOn
                      ? formatDate(new Date(assignment.returnedOn))
                      : "Pending Return "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmModal
          {...{
            handleConfirm: updateStatus,
            onCancel: handleCanceUpdateStatus,
          }}
        />
      )}
    </>
  );
}

ItemDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
