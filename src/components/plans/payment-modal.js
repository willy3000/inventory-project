import React, { useEffect, useState } from "react";
import axiosInstance from "../hocs/axiosInstance";
import { BASE_URL, formatPhoneNumber } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSubscription } from "@/store/slices/subscriptionSlice";
import axios from "axios";

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

export default function PaymentModal(props) {
  const { selectedPlan, setShowPaymentModal, setShowFeaturesModal, user } =
    props;
  const [theme, setTheme] = React.useState("dark");
  const colors = themeColors[theme];
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [subscriptionDetails, setSubscriptionetails] = useState({
    mobileNumber: "",
    paymentMethod: null,
    amount: selectedPlan?.price_pm * 12 * 0.8,
    billingCycle: "yearly",
    planId: selectedPlan?.planId,
  });

  const getPaymentAmount = () => {
    if (billingCycle === "yearly") {
      setSubscriptionetails({
        ...subscriptionDetails,
        amount: selectedPlan?.price_pm * 12 * 0.8,
      });
    } else {
      return setSubscriptionetails({
        ...subscriptionDetails,
        amount: selectedPlan?.price_pm,
      });
    }
  };

  const getSubscriptionPlan = async (user) => {
    const url = `${BASE_URL}/api/plans/getSubscriptionPlanById`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setSubscription(res.data.result));
      console.log("dispatched subscription");
    } catch (err) {
      alert(err.message);
    }
  };

  const initializePayment = async () => {
    setIsLoading(true);
    const paymentDetails = {
      phone: formatPhoneNumber(subscriptionDetails?.mobileNumber),
      amount: subscriptionDetails?.amount,
    };

    console.log("Processing payment", paymentDetails);

    try {
      const url = `${BASE_URL}/api/payment/initializeMpesaStkPush`;
      const res = await axiosInstance.post(
        url,
        { ...paymentDetails, user: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("actual reference ", res.data.data.reference);
      localStorage.setItem("reference_no", res.data.data.reference);
      setPaymentInitialized(true);
    } catch (err) {}
    setIsLoading(false);
  };

  const validatePayment = async () => {
    setIsProcessingPayment(true);
    const reference = localStorage.getItem("reference_no");
    console.log("reference_no", reference);
    alert(JSON.stringify(user));
    try {
      const url = `${BASE_URL}/api/payment/validateMpesaPayment`;
      const res = await axios.post(`${url}/${reference}`, {
        businessName: user?.businessName,
        email: user?.email,
      });
      console.log(res);
      if (res.data.success) {
        console.log("transaction cofirmed");
        await handleSubscription();
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
        localStorage.removeItem("reference_no");
      } else {
        console.log("transaction failed");
        setIsProcessingPayment(false);
        setPaymentError(true);
      }
    } catch (err) {
      setIsProcessingPayment(false);
      setPaymentError(true);
    }
  };

  const handleSubscription = async () => {
    try {
      const url = `${BASE_URL}/api/plans/handlePaymentAndSubscription`;
      const res = await axiosInstance.post(
        `${url}/${user?.userId}`,
        { ...subscriptionDetails },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 ${colors.overlay} backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn`}
    >
      <div
        className={`${
          colors.modal
        } p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl ${
          theme === "dark" ? "shadow-indigo-500/20" : "shadow-gray-400/30"
        } border ${colors.border} relative ${
          isProcessingPayment || paymentSuccess || paymentError
            ? "pointer-events-none"
            : ""
        }`}
      >
        {isProcessingPayment && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10 animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4">Processing payment...</p>
            </div>
          </div>
        )}
        {paymentSuccess && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10 animate-fadeIn pointer-events-auto">
            <div className="flex flex-col items-center animate-success">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-success-circle">
                <i className="fas fa-check text-3xl text-white animate-success-check"></i>
              </div>
              <p className="text-white mt-4 text-lg font-medium">
                Payment successful!
              </p>
              <p className="text-gray-300 mt-2">Thank you for your purchase</p>
              <button
                onClick={() => {
                  setPaymentSuccess(false);
                  setShowPaymentModal(false);
                  setSubscriptionetails({
                    ...subscriptionDetails,
                    paymentMethod: null,
                  });
                  setShowFeaturesModal(true);
                }}
                className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {paymentError && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10 animate-fadeIn pointer-events-auto">
            <div className="flex flex-col items-center animate-success">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-success-circle">
                <i className="fas fa-times text-3xl text-white animate-success-check"></i>
              </div>
              <p className="text-white mt-4 text-lg font-medium">
                Payment failed
              </p>
              <p className="text-gray-300 mt-2">
                Please try again or contact support if issue persists
              </p>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setPaymentError(false);
                    setPaymentSuccess(false);
                    setPaymentInitialized(false);
                    setSubscriptionetails({
                      ...subscriptionDetails,
                      paymentMethod: null,
                    });
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setPaymentError(false);
                    setShowPaymentModal(false);
                  }}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
            {selectedPlan?.planName}
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            $
            {subscriptionDetails?.billingCycle === "yearly"
              ? (selectedPlan?.price_pm * 12 * 0.8).toFixed(2)
              : selectedPlan?.price_pm}
            <span className="text-sm text-gray-400">
              /
              {subscriptionDetails?.billingCycle === "yearly"
                ? "year"
                : "month"}
            </span>
            {subscriptionDetails?.billingCycle === "yearly" && (
              <span className="ml-2 text-sm text-green-400">Save 20%</span>
            )}
          </div>
          <div
            className={`mt-4 flex gap-2 p-1 ${colors.surfaceAlt} rounded-lg relative`}
          >
            <div
              className={`absolute inset-y-1 ${
                subscriptionDetails?.billingCycle === "monthly"
                  ? "left-1"
                  : "left-[50%]"
              } w-[calc(50%-4px)] bg-indigo-600 rounded-md transition-all duration-300 ease-in-out transform`}
            ></div>
            <button
              onClick={() =>
                setSubscriptionetails({
                  ...subscriptionDetails,
                  billingCycle: "monthly",
                })
              }
              className={`flex-1 py-2 px-4 rounded-md text-sm relative transition-colors duration-300 ${
                subscriptionDetails?.billingCycle === "monthly"
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() =>
                setSubscriptionetails({
                  ...subscriptionDetails,
                  billingCycle: "yearly",
                })
              }
              className={`flex-1 py-2 px-4 rounded-md text-sm relative transition-colors duration-300 ${
                subscriptionDetails?.billingCycle === "yearly"
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {/* <div
            onClick={() =>
              setSubscriptionetails({
                ...subscriptionDetails,
                paymentMethod: "credit",
              })
            }
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              subscriptionDetails?.paymentMethod === "credit"
                ? "bg-indigo-600/20 border-2 border-indigo-500"
                : `${
                    theme === "dark"
                      ? "bg-gray-700/30 hover:bg-gray-700/50"
                      : "bg-gray-100 hover:bg-gray-200"
                  } border-2 border-transparent`
            }`}
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mr-4">
              <i className="fab fa-cc-stripe text-2xl text-blue-400"></i>
            </div>
            <div className="flex-grow">
              <div className="font-medium text-white flex items-center justify-between">
                <span>Credit Card</span>
                {subscriptionDetails?.paymentMethod === "credit" && (
                  <i className="fas fa-check-circle text-indigo-400 ml-2 text-xl animate-bounceIn"></i>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Pay with Visa, Mastercard
              </div>
            </div>
          </div> */}
          <div
            onClick={() =>
              setSubscriptionetails({
                ...subscriptionDetails,
                paymentMethod: "mpesa",
              })
            }
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              subscriptionDetails?.paymentMethod === "mpesa"
                ? "bg-indigo-600/20 border-2 border-indigo-500"
                : `${
                    theme === "dark"
                      ? "bg-gray-700/30 hover:bg-gray-700/50"
                      : "bg-gray-100 hover:bg-gray-200"
                  } border-2 border-transparent`
            }`}
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-mobile-alt text-2xl text-green-500"></i>
            </div>
            <div className="flex-grow">
              <div className="font-medium text-white flex items-center justify-between">
                <span>M-Pesa</span>
                {subscriptionDetails?.paymentMethod === "mpesa" && (
                  <i className="fas fa-check-circle text-indigo-400 ml-2 text-xl animate-bounceIn"></i>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Pay with M-Pesa mobile money
              </div>
              {subscriptionDetails?.paymentMethod === "mpesa" && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={subscriptionDetails?.mobileNumber}
                    onChange={(e) =>
                      setSubscriptionetails({
                        ...subscriptionDetails,
                        mobileNumber: e.target.value,
                      })
                    }
                    placeholder="Enter your M-Pesa number"
                    className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="mobileNumber"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between text-gray-400 mb-2">
            <span>Subtotal</span>
            <span>
              $
              {subscriptionDetails?.billingCycle === "yearly"
                ? (selectedPlan?.price_pm * 12).toFixed(2)
                : selectedPlan?.price_pm}
            </span>
          </div>
          {subscriptionDetails?.billingCycle === "yearly" && (
            <div className="flex justify-between text-green-400 mb-2">
              <span>Yearly Discount</span>
              <span>-${(selectedPlan?.price_pm * 12 * 0.2).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-white mt-2">
            <span>Total</span>
            <span>
              $
              {subscriptionDetails?.billingCycle === "yearly"
                ? (selectedPlan?.price_pm * 12 * 0.8).toFixed(2)
                : selectedPlan?.price_pm}
            </span>
          </div>
        </div>

        {paymentInitialized ? (
          <>
            <div className="flex items-start gap-3 p-4 mt-4 rounded-2xl bg-green-50 border border-green-500 shadow-sm max-w-md">
              {/* <Info className="text-green-600 mt-1" size={20} /> */}
              <p className="text-sm text-green-800 leading-relaxed">
                Please complete the payment on your mobile device, then click{" "}
                <strong>Confirm Payment</strong> once you are done.
              </p>
            </div>
            <button
              onClick={() => validatePayment()}
              className={
                "w-full mt-8 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 shadow-lg shadow-green-500/30"
              }
            >
              Confirm Payment
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              initializePayment();
            }}
            disabled={
              subscriptionDetails?.paymentMethod !== "mpesa" ||
              isProcessingPayment ||
              !subscriptionDetails?.mobileNumber
            }
            className={`w-full mt-8 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              subscriptionDetails?.paymentMethod &&
              !isProcessingPayment &&
              (subscriptionDetails?.paymentMethod !== "mpesa" ||
                subscriptionDetails?.mobileNumber)
                ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-lg shadow-indigo-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {subscriptionDetails?.paymentMethod ? (
              isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Initializing Payment
                </span>
              ) : (
                <span>Continue to payment</span>
              )
            ) : (
              "Select Payment Method"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
