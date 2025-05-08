import React, { useEffect, useState } from "react";
import Layout from "../../dashboard";
import { useSelector } from "react-redux";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";

export default function Stats() {
  const user = useSelector((state) => state.user.user);
  const [itemStatusStats, setItemStatusStats] = useState(null);
  const [stockLevelStats, setStockLevelStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = React.useState(false);

  const getItemStatusStats = async () => {
    const url = `${BASE_URL}/api/stats/getItemStatusStats`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      setItemStatusStats(res.data.result);
    } catch (err) {}
    setLoading(false);
  };
  const getStockLevelStats = async () => {
    const url = `${BASE_URL}/api/stats/getStockLevelStats`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      setStockLevelStats(res.data.result);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getItemStatusStats();
    getStockLevelStats();
    setIsVisible(true);
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  const stats = {
    activeItems: 350,
    damagedItems: 25,
    maintenanceItems: 15,
    stockLevels: {
      "Low Stock": 25,
      "Moderate Stock": 150,
      Optimal: 130,
      Overstocked: 45,
    },
    categoryDistribution: {
      Electronics: 150,
      Audio: 200,
      Accessories: 40,
    },
    warrantyStatus: {
      valid: 280,
      expired: 70,
      nearExpiry: 40,
    },
    assignmentStatus: {
      assigned: 200,
      unassigned: 150,
    },
  };

  return (
    <div className="space-y-8 overflow-y-auto max-h-[70vh] p-4">
      <div className="text-xl font-semibold text-gray-200 mb-4">
        Item Status
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Items</h3>
            <div className="p-2 bg-indigo-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-box text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {itemStatusStats?.active || 0}
          </div>
          <div className="text-indigo-200 text-sm">Up & Running</div>
        </div>
        <div
          className={`bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-100`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Damaged Items</h3>
            <div className="p-2 bg-red-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-exclamation-triangle text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {itemStatusStats?.damaged || 0}
          </div>
          <div className="text-red-200 text-sm">Needs attention</div>
        </div>
        <div
          className={`bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Maintenance</h3>
            <div className="p-2 bg-yellow-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-tools text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {itemStatusStats?.under_maintenance || 0}
          </div>
          <div className="text-yellow-200 text-sm">Under maintenance</div>
        </div>
      </div>
      <div className="text-xl font-semibold text-gray-200 mb-4">
        Stock Level
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Low Stock</h3>
            <div className="p-2 bg-orange-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-exclamation-circle text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stockLevelStats?.lowStock || 0}
          </div>
          <div className="text-orange-200 text-sm">Items need restocking</div>
        </div>
        <div
          className={`bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Moderate Stock</h3>
            <div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-balance-scale text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stockLevelStats?.moderateStock || 0}
          </div>
          <div className="text-blue-200 text-sm">Items at moderate level</div>
        </div>
        <div
          className={`bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-400`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Optimal Stock</h3>
            <div className="p-2 bg-green-500 bg-opacity-30 rounded-lg">
              <i className="fas fa-check-circle text-2xl text-white"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {stockLevelStats?.optimalStock || 0}
          </div>
          <div className="text-green-200 text-sm">Items at optimal level</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-400`}
        >
          <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center">
            <i className="fas fa-chart-pie mr-3 text-indigo-500"></i>
            Category Distribution
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.categoryDistribution).map(
              ([category, count], index) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 flex items-center">
                      <i
                        className={`fas fa-${
                          category.toLowerCase() === "electronics"
                            ? "laptop"
                            : category.toLowerCase() === "audio"
                            ? "headphones"
                            : "box"
                        } mr-2`}
                      ></i>
                      {category}
                    </span>
                    <span className="text-gray-400">{count} items</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                          {Math.round((count / 390) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                      <div
                        style={{
                          width: isVisible ? `${(count / 390) * 100}%` : "0%",
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"
                      ></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div
          className={`bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } delay-500`}
        >
          <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center">
            <i className="fas fa-shield-alt mr-3 text-purple-500"></i>
            Warranty Status
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(stats.warrantyStatus).map(
              ([status, count], index) => (
                <div key={status} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400 capitalize">
                        {status}
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">
                        {count}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        status === "valid"
                          ? "bg-green-500 bg-opacity-20"
                          : status === "expired"
                          ? "bg-red-500 bg-opacity-20"
                          : "bg-yellow-500 bg-opacity-20"
                      }`}
                    >
                      <i
                        className={`fas fa-${
                          status === "valid"
                            ? "check"
                            : status === "expired"
                            ? "times"
                            : "exclamation"
                        } text-xl ${
                          status === "valid"
                            ? "text-green-500"
                            : status === "expired"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      ></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          status === "valid"
                            ? "bg-green-500"
                            : status === "expired"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{
                          width: isVisible ? `${(count / 390) * 100}%` : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Stats.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
