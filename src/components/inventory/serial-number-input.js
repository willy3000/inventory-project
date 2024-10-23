import React, { useState, useEffect } from "react";
import useScanDetection from "use-scan-detection";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

export default function SerialNumberInput(props) {
  const {
    formData,
    setFormData,
    user,
    itemGroup,
    getGroupItems,
    setSerialNumberModal,
  } = props;
  const [barCode, setBarcode] = useState(null);

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
      const res = await axios.post(
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
        playBeep()
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const playBeep = () => {
    const beepSound = new Audio('/sounds/success-beep.mp3'); // Path to the sound in the public folder
    beepSound.play();
  };

  useEffect(() => {
    handleSetSerialNumber();
  }, [barCode]);

  console.log("barcode data", formData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[400px] max-w-full">
        <div className="justify-center flex">
          <h3 className="text-2xl font-bold text-gray-200 mb-6 flex items-center min-w-fit">
            Scan barcode
          </h3>
        </div>
        <div className=" flex w-full">
          <img src="/barcode.png" alt="" />
        </div>
        <form className="space-y-6">
          <div className="relative">
            <i className="fas fa-tag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Serial No."
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="serialNumber"
              value={formData.serialNumber}
              // onChange={handleSetSerialNumber}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSerialNumberModal(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
            >
              <i className="fas fa-check mr-2"></i>
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
