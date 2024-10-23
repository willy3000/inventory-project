import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import InventoryTable from "@/components/inventory/inventory-table";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/itemsSlice";
import { BASE_URL } from "@/utils/constants";

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const user = useSelector((state) => state.user.user);
  const [quantities, setQuantities] = useState(null);

  const getInventoryItems = async () => {
    const url = `${BASE_URL}/api/inventory/getInventoryItems`;
    console.log("fetching inventory");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setItems(res.data.result));
    } catch (err) {}
    setLoading(false);
  };

  const getItemQuantities = async () => {
    const url = `${BASE_URL}/api/inventory/getItemQuantities`;
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      setQuantities(res.data.result);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getInventoryItems();
    getItemQuantities();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <InventoryTable {...{ items, getInventoryItems, quantities }} />;
}

Inventory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
