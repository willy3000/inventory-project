import React from "react";
import axiosInstance from "../hocs/axiosInstance";
import { BASE_URL } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { setSubscription } from "@/store/slices/subscriptionSlice";

const themeColors = {
  dark: {
    background: "bg-gray-900",
    surface: "bg-gray-800",
    surfaceAlt: "bg-gray-700",
    surfaceHover: "hover:bg-gray-700",
    text: "text-gray-100",
    textSecondary: "text-gray-400",
    textTertiary: "text-gray-300",
    border: "border-gray-700",
    input: "bg-gray-700",
    overlay: "bg-black/70",
    modal: "bg-gray-800/90",
  },
  light: {
    background: "bg-gray-100",
    surface: "bg-white",
    surfaceAlt: "bg-gray-50",
    surfaceHover: "hover:bg-gray-100",
    text: "text-gray-900",
    textSecondary: "text-gray-700",
    textTertiary: "text-gray-600",
    border: "border-gray-300",
    input: "bg-white",
    overlay: "bg-gray-600/30",
    modal: "bg-white",
  },
};

export default function FeaturesModal(props) {
  const { features, planName, setShowFeaturesModal, user } = props;
  const theme = "dark";
  const colors = themeColors[theme];
  const dispatch = useDispatch();

  const getSubscriptionPlan = async (user) => {
    const url = `${BASE_URL}/api/plans/getSubscriptionPlanById`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setSubscription(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 ${colors.overlay} backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn`}
    >
      <div
        className={`${
          colors.modal
        } p-8 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl ${
          theme === "dark" ? "shadow-indigo-500/20" : "shadow-gray-400/30"
        } border ${colors.border}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-200">
              Welcome to {planName}! 🎉
            </h3>
            <p className="text-gray-400 mt-2">
              Here are all the features included in your plan
            </p>
          </div>
          <button
            onClick={() => {
              setShowFeaturesModal(false);
              getSubscriptionPlan(user);
            }}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-indigo-600/10 rounded-xl border border-indigo-500/20 hover:bg-indigo-600/20 transition-colors group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4 group-hover:bg-indigo-500/20 transition-colors">
                  <i
                    className={`fas ${feature?.icon} text-indigo-400 text-lg group-hover:text-indigo-300 transition-colors`}
                  ></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">
                  {feature}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              setShowFeaturesModal(false);
              getSubscriptionPlan(user);
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-colors"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
