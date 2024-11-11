import React, { useState, useEffect } from "react";
import LoadingIndicator from "../hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AddItemModal from "./add-item-modal";
import { BASE_URL } from "@/utils/constants";
import InventoryEditGuard from "../auth/inventory-edit-guard";
import NoItems from "@/components/hocs/no-items";

const categories = ["software", "hardware"];
const limitOptions = [5, 10, 20, 50, 100];

export default function InventoryTable(props) {
  const {
    items,
    getInventoryItems,
    quantities,
    pageDetails,
    totalItems,
    setPageDetails,
    filters,
    setFilters,
    loading,
  } = props;
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const router = useRouter();

  const handleViewItemGroup = (id) => {
    router.push(`inventory/${id}`);
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
        const url = URL.createObjectURL(imgFile);
        return url;
      }
    }

    return null;
  };

  const totalPages = Math.ceil(totalItems / pageDetails.limit);
  const paginate = (pageNumber) =>
    setPageDetails({ ...pageDetails, page: pageNumber });

  const getQuantity = (groupId) => {
    if (groupId) {
      try {
        return quantities[groupId] || 0;
      } catch (err) {
        return 0;
      }
    }
    return 0;
  };

  return (
    <div className="overflow-x-auto h-[70vh] overflow-y-auto">
      <div className="flex justify-between mb-4 items-center">
        <h3 className="text-xl font-semibold text-gray-200">Inventory Items</h3>
        <InventoryEditGuard>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-100 mx-5"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Item</span>
          </button>
        </InventoryEditGuard>
      </div>
      <div className="mb-6 space-y-6 p-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="flex items-center px-4 py-3 bg-gray-700/30 rounded-lg">
                <i className="fas fa-search text-gray-400 mr-3"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters({ ...filters, searchQuery: e.target.value })
                  }
                  className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
                  name="search"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="px-3 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              name="category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-sliders-h"></i>
              <span className="hidden md:inline">More Filters</span>
            </button>
          </div>
        </div>
      </div>
      {showAdvancedFilters && (
        <div className="bg-gray-700/30 p-4 rounded-lg animate-slideDown mb-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Quantity Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minQuantity}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minQuantity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                name="minQuantity"
                min="0"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxQuantity}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxQuantity: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                name="maxQuantity"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      {items?.length === 0 && !loading ? (
        <NoItems
          {...{
            message:
              'Your inventory is empty. Click the "Add Item" button to start adding items to your inventory.',
            openModal: setShowAddItemModal,
            icon: "fa-box-open",
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
                Item Name
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Type
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Quantity
              </th>
              <th className="p-4 text-gray-200 font-semibold text-center bg-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-gray-700"
                onClick={() => handleViewItemGroup(item?.id)}
              >
                <td className="p-4 border-b border-gray-600">
                  <img
                    src={
                      item?.image
                        ? getImageUrl(item?.image)
                        : "/images/placeholder-image.jpg"
                    }
                    alt={item?.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.name}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {item?.type}
                </td>
                <td className="p-4 text-gray-300 border-b border-gray-600 text-center">
                  {getQuantity(item?.id)}
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

      <div className="mt-4 flex justify-between">
        <div className="flex items-center space-x-2 text-gray-400">
          <span>Show</span>
          <select
            value={pageDetails.limit}
            onChange={(e) => {
              setPageDetails({ ...pageDetails, limit: Number(e.target.value) });
              setCurrentPage(1);
            }}
            className="bg-gray-700 border border-gray-600 text-gray-200 px-2 py-1 rounded"
            name="limit"
          >
            {limitOptions.map((option) => {
              return <option value={option}>{option}</option>;
            })}
          </select>
          <span>entries</span>
        </div>
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(pageDetails.page - 1)}
            disabled={pageDetails.page === 1}
            className="px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 flex items-center"
          >
            <i className="fas fa-chevron-left mr-1"></i>
            Prev
          </button>
          {[...Array(totalPages ? totalPages : 0).keys()].map((number) => (
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
        <AddItemModal {...{ setShowAddItemModal, getInventoryItems }} />
      )}

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js"></script>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
