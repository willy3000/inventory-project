import React from "react";

export default function PaymentModal(props) {
  const {
    selectedPlan,
    billingCycle,
    selectedPaymentMethod,
    setBillingCycle,
    setSelectedPaymentMethod,
    setShowPaymentModal
  } = props;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-800/90 p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl shadow-indigo-500/20 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-200">Payment Details</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Selected Plan</div>
          <div className="text-lg font-semibold text-white">
            {selectedPlan?.name}
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            $
            {billingCycle === "yearly"
              ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
              : selectedPlan?.price}
            <span className="text-sm text-gray-400">
              /{billingCycle === "yearly" ? "year" : "month"}
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-2 text-sm text-green-400">Save 20%</span>
            )}
          </div>
          <div className="mt-4 flex gap-2 p-1 bg-gray-700/30 rounded-lg relative">
            <div
              className={`absolute inset-y-1 ${
                billingCycle === "monthly" ? "left-1" : "left-[50%]"
              } w-[calc(50%-4px)] bg-indigo-600 rounded-md transition-all duration-300 ease-in-out transform`}
            ></div>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`flex-1 py-2 px-4 rounded-md text-sm relative z-10 transition-colors duration-300 ${
                billingCycle === "monthly" ? "text-white" : "text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex-1 py-2 px-4 rounded-md text-sm relative z-10 transition-colors duration-300 ${
                billingCycle === "yearly" ? "text-white" : "text-gray-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div
            onClick={() => setSelectedPaymentMethod("credit")}
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === "credit"
                ? "bg-indigo-600/20 border-2 border-indigo-500"
                : "bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent"
            }`}
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mr-4">
              <i className="fab fa-cc-stripe text-2xl text-blue-400"></i>
            </div>
            <div className="flex-grow">
              <div className="font-medium text-white flex items-center justify-between">
                <span>Credit Card</span>
                {selectedPaymentMethod === "credit" && (
                  <i className="fas fa-check-circle text-indigo-400 ml-2 text-xl animate-bounceIn"></i>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Pay with Visa, Mastercard
              </div>
            </div>
          </div>
          <div
            onClick={() => setSelectedPaymentMethod("mpesa")}
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedPaymentMethod === "mpesa"
                ? "bg-indigo-600/20 border-2 border-indigo-500"
                : "bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent"
            }`}
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-mobile-alt text-2xl text-green-500"></i>
            </div>
            <div className="flex-grow">
              <div className="font-medium text-white flex items-center justify-between">
                <span>M-Pesa</span>
                {selectedPaymentMethod === "mpesa" && (
                  <i className="fas fa-check-circle text-indigo-400 ml-2 text-xl animate-bounceIn"></i>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Pay with M-Pesa mobile money
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Subtotal</span>
            <span>
              $
              {billingCycle === "yearly"
                ? (selectedPlan?.price * 12).toFixed(2)
                : selectedPlan?.price}
            </span>
          </div>
          {billingCycle === "yearly" && (
            <div className="flex justify-between text-green-400 mb-2">
              <span>Yearly Discount</span>
              <span>-${(selectedPlan?.price * 12 * 0.2).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-white mt-2">
            <span>Total</span>
            <span>
              $
              {billingCycle === "yearly"
                ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
                : selectedPlan?.price}
            </span>
          </div>
        </div>
        <button
          disabled={!selectedPaymentMethod}
          className={`w-full mt-8 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
            selectedPaymentMethod
              ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-lg shadow-indigo-500/30"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedPaymentMethod
            ? "Continue to Payment"
            : "Select Payment Method"}
        </button>
      </div>
    </div>
  );
}
