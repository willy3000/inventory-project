import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import InventoryTable from "@/components/inventory/inventory-table";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/itemsSlice";

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const user = useSelector((state) => state.user.user);

  const getInventoryItems = async () => {
    const url = "http://localhost:5000/api/inventory/getInventoryItems";
    console.log("fetching inventory");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setItems(res.data.result));
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getInventoryItems();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <InventoryTable {...{ items, getInventoryItems }} />;
}

Inventory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
