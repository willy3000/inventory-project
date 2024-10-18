"use client";
import React, { useState, useEffect } from "react";
import InventoryTable from "@/components/inventory/inventory-table";
import AuthGuard from "@/components/auth/auth-guard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { setItems } from "@/store/slices/itemsSlice";
import axios from "axios";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";

function Layout({ children }) {
  const [activeTab, setActiveTab] = React.useState("");
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log
    if (router.pathname === "/dashboard") {
      router.replace("/dashboard/inventory");
    }
    const currentRoute = router.pathname.split('/')[2] || 'inventory'; // Default to 'inventory' if no sub-route
    setActiveTab(currentRoute);
    console.log(router)
  }, []);

  const handleTabChange = (title) => {
    router.push(`/dashboard/${title.toLowerCase()}`);
    setActiveTab(title.toLowerCase());
  };

  const DashboardLink = ({ title, icon, isActive }) => (
    <button
      onClick={() => handleTabChange(title)}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
        isActive
          ? "bg-indigo-900 text-indigo-300"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <i className={`fas ${icon} text-lg`}></i>
      <span className="font-medium">{title}</span>
    </button>
  );

  const UserMenu = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        router.push("/authentication");
        dispatch(setUser(null));
        localStorage.setItem("user", null);
        localStorage.setItem("token", null);
        setIsLoggingOut(false);
      }, 2000);
    };
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <i className="fas fa-user-circle text-2xl"></i>
          <span>{user?.username}</span>
          <i className={`fas fa-chevron-${showUserMenu ? "up" : "down"}`}></i>
        </button>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              onClick={() => handleLogout()}
            >
              {isLoggingOut ? (
                <div className="w-full flex justify-between items-center">
                  <p>Goodbye...</p>
                  <LoadingIndicator height="30%" width={"30%"} />
                </div>
              ) : (
                <p>Logout</p>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const ContentArea = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 capitalize">
        {activeTab}
      </h2>
      {children}
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-100 h-[60vh]">
        <div className="flex">
          <nav className="bg-gray-800 w-64 h-screen p-5 shadow-sm">
            <h1 className="text-2xl font-bold text-indigo-400 mb-8">
              Dashboard
            </h1>
            <div className="space-y-2">
              <DashboardLink
                title="Inventory"
                icon="fa-boxes"
                isActive={activeTab === "inventory"}
              />
              <DashboardLink
                title="Employees"
                icon="fa-users"
                isActive={activeTab === "employees"}
              />
              <DashboardLink
                title="Stats"
                icon="fa-chart-bar"
                isActive={activeTab === "stats"}
              />
              <DashboardLink
                title="Reports"
                icon="fa-file-alt"
                isActive={activeTab === "reports"}
              />
            </div>
          </nav>
          <main className="flex-grow p-8">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-200">
                  Welcome back!
                </h2>
                <p className="text-gray-400">
                  Here's what's happening with your business today.
                </p>
              </div>
              <UserMenu />
            </header>
            <ContentArea />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Layout;
