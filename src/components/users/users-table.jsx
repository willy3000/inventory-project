import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AddUserModal from "./add-user-modal";
import NoItems from "../hocs/no-items";
import LoadingIndicator from "../hocs/LoadingIndicator";

export default function UsersTable(props) {
  const { operators, getInventoryOperators, loading } = props;
  const router = useRouter();
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

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
    return null;
  };

  const totalPages = Math.ceil(operators.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewmployeeDetails = (id) => {
    router.push(`${router.asPath}/${id}`);
  };

  const getPlaceholderImage = (gender) => {
    if (gender === "FEMALE") {
      return "/images/female-employee.png";
    }
    return "/images/male-employee.jpeg";
  };

  const getUserStatus = (disabled) => {
    if (disabled) {
      return (
        <span className={`text-red-500 flex items-center space-x-2`}>
          <i className={`fas fa-times-circle`}></i>
          <span>{"inactive"}</span>
        </span>
      );
    }
    return (
      <span className={`text-green-500 flex items-center space-x-2`}>
        <i className={`fas fa-check-circle`}></i>
        <span>{"active"}</span>
      </span>
    );
  };

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-200">Users</h3>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-100 mx-5"
        >
          <i className="fas fa-plus-circle"></i>
          <span>Add User</span>
        </button>
      </div>
      {operators?.length === 0 && !loading ? (
        <NoItems
          {...{
            message:
              'Your have no users yet. Click the "Add User" button to start adding users to your business.',
            openModal: setShowAddUserModal,
            icon: "fa-tools",
          }}
        />
      ) : loading ? (
        <LoadingIndicator />
      ) : (
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700 rounded-tl-lg">
                Image
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Name
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                User Code
              </th>
              <th className="p-4 text-gray-200 font-semibold text-left bg-gray-700">
                Status
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator) => (
              <tr
                key={operator.id}
                className="transition-colors hover:bg-gray-700"
                onClick={() => handleViewmployeeDetails(operator?.id)}
              >
                <td className="p-4 border-b border-gray-600">
                  <img
                    src={
                      operator?.image
                        ? getImageUrl(operator?.image)
                        : "/images/user-placeholder.webp"
                    }
                    alt={operator?.username}
                    className="w-16 h-16 object-cover rounded-full shadow-md"
                  />
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {operator?.username}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {operator.userCode}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {getUserStatus(operator.disabled)}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  <button>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-end">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
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
                currentPage === number + 1
                  ? "text-indigo-500 bg-gray-700"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 flex items-center"
          >
            Next
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </div>
      {showAddUserModal && (
        <AddUserModal {...{ setShowAddUserModal, getInventoryOperators }} />
      )}
    </div>
  );
}
