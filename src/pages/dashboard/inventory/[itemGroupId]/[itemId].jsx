import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/dashboard";
import ItemGroupTable from "@/components/inventory/item-group-table";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { setGroupItems } from "@/store/slices/groupItemsSlice";
import { setEmployees } from "@/store/slices/employeesSlice";

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
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    purchaseDate: null,
    warrantyExpiry: null,
    assignedTo: null,
    status: "active",
  });

  const getEmployees = async () => {
    const url = "http://localhost:5000/api/employees/getEmployees";
    console.log("fetching employees");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setEmployees(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  const assignmentHistory = [
    {
      id: 1,
      assignedTo: "John Doe",
      assignedDate: "2023-01-15",
      returnDate: "2023-03-15",
    },
    {
      id: 2,
      assignedTo: "Jane Smith",
      assignedDate: "2023-03-16",
      returnDate: "2023-05-16",
    },
    {
      id: 3,
      assignedTo: "Mike Johnson",
      assignedDate: "2023-05-17",
      returnDate: null,
    },
  ];

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

  const getItemById = async () => {
    const url = "http://localhost:5000/api/inventory/getItemById";
    console.log("fetching group id");
    try {
      const res = await axios.get(
        `${url}/${user?.userId}/${itemGroupId}/${itemId}`
      );
      console.log("dipatching item by id", res.data.result);
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

  const getAssignedEmployee = (employeeId) => {
    const employee = employees.find((employee) => employee.id === employeeId);

    if (!employee) {
      return null;
    }

    return (
      <div className="flex items-center bg-gray-600 rounded-full p-2 max-w-fit">
        <img
          src={getImageUrl(employee?.image)}
          alt={`${employee?.name}`}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-s truncate max-w-[100px]">
          {employee?.employeeName}
        </span>
        <i className="fas fa-times px-2 text-gray-400 hover:cursor-pointer"></i>
      </div>
    );
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, status: status });
    setShowStatusList(false);
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
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                Warranty Expiry Date
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
              <button
                onClick={(e) => {}}
                className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-slate-500 disabled:opacity-50 flex items-center"
              >
                Assign
              </button>
            )}
          </div>

          <div className="flex items-center gap-5 justify-around">
            <p className="text-gray-400">Satus:</p>
            <div className="relative">
              <button
                onClick={() => setShowStatusList(!showStatusList)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
              >
                <div
                  className={`flex items-center ${getStatusColor(
                    formData?.status
                  )} rounded-full p-2 max-w-fit gap-2`}
                >
                  <span className="text-s truncate max-w-fit">
                    {formData?.status}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      showStatusList ? "up" : "down"
                    }`}
                  ></i>
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
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-gray-200 font-semibold rounded-tl-lg">
                Assigned To
              </th>
              <th className="p-3 text-gray-200 font-semibold">Assigned Date</th>
              <th className="p-3 text-gray-200 font-semibold rounded-tr-lg">
                Return Date
              </th>
            </tr>
          </thead>
          <tbody>
            {assignmentHistory.map((assignment) => (
              <tr key={assignment.id} className="border-b border-gray-700">
                <td className="p-3 text-gray-300">{assignment.assignedTo}</td>
                <td className="p-3 text-gray-300">{assignment.assignedDate}</td>
                <td className="p-3 text-gray-300">
                  {assignment.returnDate || "Not returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

ItemDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
