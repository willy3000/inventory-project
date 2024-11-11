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
import AdminGuard from "@/components/auth/admin-guard";

function Layout({ children }) {
  const [activeTab, setActiveTab] = React.useState("");
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const role = useSelector((state) => state.role.role);

  const isAdmin = () => {
    if (role === "admin") {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (router.pathname === "/dashboard") {
      router.replace("/dashboard/stats");
    }
    const currentRoute = router.pathname.split("/")[2] || "stats"; // Default to 'inventory' if no sub-route
    setActiveTab(currentRoute);
  }, [router]);

  const handleTabChange = (title) => {
    router.push(`/dashboard/${title.toLowerCase()}`);
    setActiveTab(title.toLowerCase());
  };

  const DashboardLink = ({ title, icon, isActive }) => (
    <button
      onClick={() => handleTabChange(title)}
      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <div className="flex items-center space-x-2">
        <i className={`fas ${icon}`}></i>
        <span>{title}</span>
      </div>
      {(title === "Users" || title === "Logs") && (
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#4a3800] rounded-full">
          admin
        </span>
      )}
      {title === "Subscription" && (
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-[#ffffff] to-[#f0f0ff] text-[#4a3800] rounded-full">
          free
        </span>
      )}
    </button>
  );

  const UserMenu = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [expandedNotification, setExpandedNotification] =
      React.useState(null);

    const [notifications, setNotifications] = React.useState([
      {
        id: 1,
        message: "Message from Admin: System maintenance scheduled for tonight",
        time: "Just now",
        icon: "fa-shield-alt",
        color: "purple",
        read: false,
        details:
          "System maintenance will be performed from 2 AM to 4 AM EST. Please save your work and log out before this time.",
        priority: "High",
        category: "System",
        actionRequired: true,
        actionText: "Acknowledge",
        affectedSystems: ["Database", "User Interface", "API"],
        duration: "2 hours",
        impact: "Service will be temporarily unavailable",
      },
      {
        id: 2,
        message: "New order received",
        time: "5 minutes ago",
        icon: "fa-shopping-cart",
        color: "green",
        read: false,
        details:
          "Order #12345 received from customer John Smith. Total amount: $599.99",
        priority: "Medium",
        category: "Orders",
        actionRequired: true,
        actionText: "Process Order",
        orderDetails: {
          items: ["Product A", "Product B"],
          shipping: "Express",
          address: "123 Main St, City",
        },
      },
      {
        id: 3,
        message: "Server update completed",
        time: "2 hours ago",
        icon: "fa-server",
        color: "blue",
        read: true,
        details:
          "Server update v2.1.0 has been successfully installed. New features include improved security and performance optimizations.",
        priority: "Low",
        category: "Updates",
        version: "2.1.0",
        changes: ["Security patches", "Performance improvements", "Bug fixes"],
        rollbackAvailable: true,
      },
      {
        id: 4,
        message: "Low stock alert: Product 3",
        time: "1 day ago",
        icon: "fa-exclamation-triangle",
        color: "yellow",
        read: false,
        details:
          "Product 3 (SKU: P3-001) has reached low stock threshold. Current quantity: 5 units. Please reorder soon.",
        priority: "High",
        category: "Inventory",
        actionRequired: true,
        actionText: "Reorder",
        threshold: 10,
        supplier: "Supplier XYZ",
        reorderQuantity: 50,
        lastOrder: "2024-01-01",
      },
    ]);

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
        <div className="flex items-center space-x-3 text-gray-300 hover:text-white">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex flex-col items-center mr-4 focus:outline-none"
            >
              <i
                className={`fas fa-bell text-2xl ${
                  notifications.filter((n) => !n.read).length > 0
                    ? "animate-ring"
                    : ""
                }`}
              ></i>
              {notifications.filter((n) => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                </div>
              )}
            </button>
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 ${
                  expandedNotification !== null ? "w-[32rem]" : "w-80"
                } bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-700 animate-fadeIn transition-all duration-300`}
              >
                <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>
                  <span className="text-xs text-gray-400">
                    {notifications.length} total
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 hover:bg-gray-700/50 cursor-pointer transition-all duration-300 ${
                        !notification.read ? "bg-gray-700/30" : ""
                      } ${expandedNotification === index ? "bg-gray-700" : ""}`}
                      onClick={() => {
                        setExpandedNotification(
                          expandedNotification === index ? null : index
                        );
                        if (!notification.read) {
                          const updatedNotifications = [...notifications];
                          updatedNotifications[index].read = true;
                          setNotifications(updatedNotifications);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <i
                            className={`fas ${notification.icon} text-${notification.color}-400`}
                          ></i>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <p
                              className={`text-sm ${
                                !notification.read
                                  ? "text-white font-medium"
                                  : "text-gray-300"
                              }`}
                            >
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-400">
                              {notification.time}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                notification.priority === "High"
                                  ? "bg-red-500/20 text-red-300"
                                  : notification.priority === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                              }`}
                            >
                              {notification.priority}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              {notification.category}
                            </span>
                          </div>
                          {expandedNotification === index && (
                            <div className="mt-3 space-y-3 text-sm border-t border-gray-700 pt-3">
                              <p className="text-gray-300">
                                {notification.details}
                              </p>
                              {notification.actionRequired && (
                                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors">
                                  {notification.actionText}
                                </button>
                              )}
                              {notification.affectedSystems && (
                                <div className="flex flex-wrap gap-2">
                                  {notification.affectedSystems.map(
                                    (system, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                                      >
                                        {system}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                              {notification.changes && (
                                <ul className="list-disc list-inside text-gray-400">
                                  {notification.changes.map((change, i) => (
                                    <li key={i}>{change}</li>
                                  ))}
                                </ul>
                              )}
                              {notification.orderDetails && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-gray-400">
                                    <span>Shipping:</span>
                                    <span>
                                      {notification.orderDetails.shipping}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>Address:</span>
                                    <span>
                                      {notification.orderDetails.address}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-700">
                  <button
                    onClick={() => {
                      const updatedNotifications = notifications.map((n) => ({
                        ...n,
                        read: true,
                      }));
                      setNotifications(updatedNotifications);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="relative flex flex-col items-center">
              <i className="fas fa-user-circle text-2xl"></i>
              <div
                className={`absolute -bottom-2 px-1.5 py-0.5 text-[8px] font-medium tracking-wide rounded-full ${
                  isAdmin()
                    ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#4a3800] shadow-lg shadow-[#FFA500]/30 border border-[#FFD700]"
                    : "bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg shadow-gray-500/30"
                }`}
              >
                {isAdmin() ? "admin" : "user"}
              </div>
            </div>
            <span>{user?.username}</span>
            <i className={`fas fa-chevron-${showUserMenu ? "up" : "down"}`}></i>
          </button>
        </div>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <div className="w-full flex justify-between items-center">
                  <p>Goodbye...</p>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
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
      <div className="flex items-baseline gap-2 hover:cursor-pointer">
        {router.pathname.split("/").length > 3 && (
          <i
            className={`fas fa-arrow-left-long text-lg`}
            onClick={() => router.back()}
          ></i>
        )}

        <h2 className="text-2xl font-bold mb-4 text-gray-200 capitalize">
          {router.pathname.split("/")[2] || ""}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-100 h-[60vh]">
        <div className="flex">
          <nav className="bg-gray-800 w-64 h-screen p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-400 mb-8">
                Dashboard
              </h1>
              <div className="space-y-2">
                <DashboardLink
                  title="Stats"
                  icon="fa-chart-bar"
                  isActive={activeTab === "stats"}
                />
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

                {/* <DashboardLink
                title="Reports"
                icon="fa-file-alt"
                isActive={activeTab === "reports"}
              /> */}
                <AdminGuard>
                  <DashboardLink
                    title="Users"
                    icon="fa-tools"
                    isActive={activeTab === "users"}
                  />
                </AdminGuard>
                <AdminGuard>
                  <DashboardLink
                    title="Logs"
                    icon="fa-history"
                    isActive={activeTab === "logs"}
                  />
                </AdminGuard>
                <AdminGuard>
                  <DashboardLink
                    title="Subscription"
                    icon="fa-crown"
                    isActive={activeTab === "subscription"}
                  />
                </AdminGuard>
              </div>
            </div>

            <div>
              <button
                onClick={() => setActiveTab("support")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-lg shadow-indigo-500/30 mb-4`}
              >
                <div className="flex items-center space-x-2">
                  <i className="fas fa-headset"></i>
                  <span>Support</span>
                </div>
              </button>
            </div>
          </nav>
          <main className="flex-grow p-8">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-200">
                  {`Welcome to ${user?.businessName}`}
                </h2>
                <p className="text-gray-400">
                  {"Here's what's happening with your business today"}
                </p>
              </div>

              <UserMenu />
            </header>
            <ContentArea />
          </main>
        </div>
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
          @keyframes ring {
            0% {
              transform: rotate(0deg);
            }
            10% {
              transform: rotate(15deg);
            }
            20% {
              transform: rotate(-15deg);
            }
            30% {
              transform: rotate(10deg);
            }
            40% {
              transform: rotate(-10deg);
            }
            50% {
              transform: rotate(5deg);
            }
            60% {
              transform: rotate(-5deg);
            }
            70% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out forwards;
            overflow: hidden;
          }
          .animate-ring {
            animation: ring 2s ease-in-out infinite;
            transform-origin: 50% 0;
          }
        `}</style>
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
        @keyframes ring {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          70% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes success-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-circle {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes success-check {
          0% { transform: scale(0); }
          50% { opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
          overflow: hidden;
        }
        .animate-ring {
          animation: ring 2s ease-in-out infinite;
          transform-origin: 50% 0;
        }
        .animate-success-pop {
          animation: success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-success-circle {
          animation: success-circle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-success-check {
          animation: success-check 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
          opacity: 0;
        }
      `}</style>
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
          80% {
            opacity: 1;
            transform: scale(0.89);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.87, 0, 0.13, 1);
        }
      `}</style>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes goldShine {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .group:hover i {
          animation: float 2s ease-in-out infinite;
        }
        .group:hover .gold-shine {
          background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
          background-size: 200% auto;
          animation: goldShine 6s linear infinite;
        }
      `}</style>
      </div>
    </AuthGuard>
  );
}

export default Layout;
