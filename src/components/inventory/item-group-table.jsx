import React, { useState, useEffect } from "react";
import LoadingIndicator from "../hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AddItemModal from "./add-item-modal";
import UpdateStockModal from "./update-stock-modal";
import EmployeeSelectModal from "../employees/employee-select-modal";
import axios from "axios";
import { setEmployees } from "@/store/slices/employeesSlice";
import { BASE_URL } from "@/utils/constants";

export default function ItemGroupTable(props) {
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

  const handleViewItemDetails = (id) => {
    router.push(`${router.asPath}/${id}`);
  };

  console.log("total items here are,  ", totalItems);

  const getEmployees = async () => {
    const url = `${BASE_URL}/api/employees/getEmployees`;
    console.log("fetching employees");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setEmployees(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  console.log("items", items);

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

  console.log(items);

  const handleEmployeeSelect = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setEmployeeSelectModal(true);
  };

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
      </div>
    );
  };

  useEffect(() => {
    getEmployees();
  }, []);

  console.log("new page details ", pageDetails);

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-2">
          <img
            src={getImageUrl(itemGroup.image)}
            alt={itemGroup.name}
            className="w-25 h-20 object-cover rounded-lg shadow-md"
          />
          <h3 className="text-xl font-semibold text-gray-200">
            {itemGroup.name}
          </h3>
        </div>
        <button
          onClick={() => setShowAddItemModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-100 mx-5"
        >
          <i className="fas fa-arrow-up m-2"></i>
          Update Stock
        </button>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-lg w-[100%]">
          <i className="fas fa-box-open text-6xl text-gray-400 mb-4"></i>
          <p className="text-xl font-semibold text-gray-300 mb-2">
            No items available
          </p>
          <p className="text-gray-400 text-center max-w-md">
            {'Your inventory is empty. Click the "Add Item" button to start adding items to your inventory.'}
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
                Serial No.
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Item Name
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Category
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Purchase Date
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Warranty Expiry
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                status
              </th>
              <th className="p-4 text-gray-200 font-semibold bg-gray-700">
                Assigned To
              </th>
              <th className="p-4 text-gray-200 font-semibold bg-gray-700 text-center">
                Actions
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
                  {item.serialNumber}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.name}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.category}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.purchaseDate}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.warrantyExpiry}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item.status}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.assignedTo ? (
                    getAssignedEmployee(item?.assignedTo)
                  ) : (
                    <button
                      onClick={(e) => handleEmployeeSelect(e, item)}
                      className="px-3 py-2 rounded-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-slate-500 disabled:opacity-50 flex items-center"
                    >
                      Assign
                    </button>
                  )}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  <button>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </td>
                {/* <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  <button>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </td> */}
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
      {showAddItemModal && (
        <UpdateStockModal
          {...{ setShowAddItemModal, getGroupItems, itemGroup }}
        />
      )}
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
