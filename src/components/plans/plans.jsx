import React, { useState } from "react";
import PaymentModal from "./payment-modal";
import FeaturesModal from "./features-modal";
import { useSelector } from "react-redux";

export default function Plans(props) {
  const { plans, user } = props;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState(null);
  const [billingCycle, setBillingCycle] = React.useState("yearly");
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const subscription = useSelector((state) => state.subscription.subscription);
  const planId = subscription?.planId;

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const getPlanButtonText = (id) => {
    if (id === planId) {
      return "Current Plan";
    } else {
      if (planId) {
        return "Change Plan";
      }else{
        return "Choose Plan"
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-gray-700/30 p-6 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 relative overflow-hidden group animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
            <i className="fas fa-rocket text-2xl text-indigo-400"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-2">
            {plans[0]?.planName}
          </h3>
          <div className="text-3xl font-bold text-indigo-400 mb-4">
            {`$${plans[0]?.price_pm}`}
            <span className="text-sm text-gray-400">/month</span>
          </div>
          <ul className="text-gray-300 space-y-3 mb-6">
            {plans[0]?.features.map((feature) => {
              return (
                <li className="flex items-center justify-center">
                  <i className="fas fa-check text-green-400 mr-2"></i>
                  {feature}
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => handlePlanSelect({ ...plans[0] })}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {}
            {getPlanButtonText(plans[0]?.planId)}
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 relative overflow-hidden group animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 gold-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <i className="fas fa-crown text-2xl text-yellow-300"></i>
          </div>
          <div className="inline-block px-3 py-1 bg-yellow-400 text-indigo-900 text-xs font-semibold rounded-full mb-3">
            MOST POPULAR
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {plans[1]?.planName}
          </h3>
          <div className="text-3xl font-bold text-white mb-4">
            {`$${plans[1]?.price_pm}`}
            <span className="text-sm text-indigo-200">/month</span>
          </div>
          <ul className="text-white space-y-3 mb-6">
            {plans[1]?.features.map((feature) => {
              return (
                <li className="flex items-center justify-center">
                  <i className="fas fa-check text-green-400 mr-2"></i>
                  {feature}
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => handlePlanSelect({ ...plans[1] })}
            className="w-full px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {getPlanButtonText(plans[1]?.planId)}
          </button>
        </div>
      </div>
      <div className="bg-gray-700/30 p-6 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 relative overflow-hidden group animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
            <i className="fas fa-building text-2xl text-indigo-400"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-2">
            {plans[2]?.planName}
          </h3>
          <div className="text-3xl font-bold text-indigo-400 mb-4">
            {`$${plans[2]?.price_pm}`}
            <span className="text-sm text-gray-400">/month</span>
          </div>
          <ul className="text-gray-300 space-y-3 mb-6">
            {plans[2]?.features.map((feature) => {
              return (
                <li className="flex items-center justify-center">
                  <i className="fas fa-check text-green-400 mr-2"></i>
                  {feature}
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => handlePlanSelect({ ...plans[2] })}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {getPlanButtonText(plans[2]?.planId)}
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          {...{
            selectedPlan,
            setBillingCycle,
            billingCycle,
            setShowPaymentModal,
            selectedPlan,
            setSelectedPaymentMethod,
            selectedPaymentMethod,
            setShowFeaturesModal,
            user,
          }}
        />
      )}
      {showFeaturesModal && (
        <FeaturesModal
          {...{
            features: selectedPlan?.features,
            planName: selectedPlan?.planName,
            setShowFeaturesModal,
            user,
          }}
        />
      )}

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
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes goldShine {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
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
          background: linear-gradient(90deg, #ffd700, #ffa500, #ffd700);
          background-size: 200% auto;
          animation: goldShine 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
