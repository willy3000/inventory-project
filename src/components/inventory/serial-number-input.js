import React, { useState, useEffect } from "react";
import useScanDetection from "use-scan-detection";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "../hocs/axiosInstance";
import { toast } from "react-toastify";

export default function SerialNumberInput(props) {
  const {
    formData,
    setFormData,
    user,
    itemGroup,
    getGroupItems,
    setSerialNumberModal,
    setShowAddItemModal
  } = props;
  const [barCode, setBarcode] = useState("");

  useScanDetection({
    onComplete: setBarcode,
    minLength: 3,
  });

  const handleSetSerialNumber = () => {
    setFormData({ ...formData, serialNumber: barCode });
    if (barCode) {
      handleUpdateStock({ ...formData, serialNumber: barCode });
    }
    // setFormData({...JSON.parse(barCode)})
  };

  const handleUpdateStock = async (frmData) => {
    try {
      const url = `${BASE_URL}/api/inventory/addItem`;
      const res = await axiosInstance.post(
        `${url}/${user?.userId}/${itemGroup.id}`,
        frmData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        getGroupItems();
        toast.success("item added");
        playBeep();
      } else {
        toast.error(res.data.message);
        playError();
      }
    } catch (err) {
      toast.error(err.message);
      playError();
    }
  };

  const playBeep = () => {
    const beepSound = new Audio("/sounds/success-beep.mp3"); // Path to the sound in the public folder
    beepSound.play();
  };

  const playError = () => {
    const beepSound = new Audio("/sounds/error-beep.mp3"); // Path to the sound in the public folder
    beepSound.play();
  };

  const handleDoneScanning = () => {
    setSerialNumberModal(false);
    setShowAddItemModal(false);
  };

  const handleBackToDetails = () => {
    setSerialNumberModal(false);
  };

  useEffect(() => {
    handleSetSerialNumber();
  }, [barCode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[400px] max-w-full">
        <div className="justify-between flex items-baseline">
          <i
            className="fas fa-arrow-left-long"
            onClick={handleBackToDetails}
          ></i>
          <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center min-w-fit">
            Scan barcode
          </h3>
        </div>
        <div className=" flex w-full">
          <img src="/images/barcode.png" alt="" />
        </div>
        <div className="space-y-6">
          <div className="relative">
            <i className="fas fa-tag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Serial No."
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="serialNumber"
              value={formData.serialNumber}
              readOnly
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDoneScanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
            >
              <i className="fas fa-check mr-2"></i>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
