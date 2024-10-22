import React, { useEffect, useState } from "react";
import axios from "axios";
import { setEmployees } from "@/store/slices/employeesSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../hocs/LoadingIndicator";

export default function EmployeeSelectModal(props) {
  const { setEmployeeSelectModal, user, item, getGroupItems } = props;
  const employees = useSelector((state) => state.employees.employees);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const dispatch = useDispatch();

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
    setLoading(false);
  };

  const handleAssign = async () => {
    try {
      const url = "http://localhost:5000/api/inventory/assignItem";
      const res = await axios.post(
        url,
        {
          userId: user.userId,
          employeeId: selectedEmployee,
          groupId: item?.groupId,
          itemId: item.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        getGroupItems();
      }
    } catch (err) {
      alert(err.message);
    }
  };

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

  const onClose = () => {
    setEmployeeSelectModal(false);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const handleAssignItem = () => {
    console.log("item is", item);
    console.log({
      userId: user.userId,
      employeeId: selectedEmployee,
      groupId: item?.groupId,
      itemId: item.id,
    });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[600px] max-w-full">
        <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
          <i className="fas fa-user-plus text-indigo-500 mr-3"></i>
          Select Employee
        </h3>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => handleSelectEmployee(employee.id)}
                className={`w-full p-3 ${
                  selectedEmployee === employee?.id
                    ? "bg-indigo-700"
                    : "bg-gray-700"
                } text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-between`}
              >
                <div className="flex items-center">
                  <img
                    src={getImageUrl(employee.image)}
                    alt={`${employee.name}'s profile picture`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span>{employee.employeeName}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {employee.department}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </button>
          <button
            className={
              selectedEmployee === null
                ? "border border-gray-600 text-gray-6 text-gray-600 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
                : "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
            }
            disabled={selectedEmployee === null}
            onClick={() => handleAssign()}
          >
            <i className="fas fa-check mr-2"></i>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}