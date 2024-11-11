import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import InventoryTable from "@/components/inventory/inventory-table";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/itemsSlice";
import { BASE_URL } from "@/utils/constants";
import { getServerSideProps } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import { toast } from "react-toastify";


export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const user = useSelector((state) => state.user.user);
  const [quantities, setQuantities] = useState(null);
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    limit: 5,
  });
  const [filters, setFilters] = useState({
    searchQuery: null,
    category: null,
    minQuantity: null,
    maxQuantity: null,
  });
  const [totalItems, setTotalItems] = useState(1);

  const getInventoryItems = async () => {
    setLoading(true);
    const url = `/api/inventory/getInventoryItems`;
    const queryString = `page=${pageDetails.page}&limit=${pageDetails.limit}&searchQuery=${filters.searchQuery}&type=${filters.category}&minQuantity=${filters.minQuantity}&maxQuantity=${filters.maxQuantity}`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}?${queryString}`
      );
      dispatch(setItems(res.data.result));
      setTotalItems(res.data.totalItems);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const getItemQuantities = async () => {
    const url = `${BASE_URL}/api/inventory/getItemQuantities`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      setQuantities(res.data.result);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getItemQuantities();
  }, []);
  useEffect(() => {
    getInventoryItems();
  }, [pageDetails, filters]);
  return (
    <InventoryTable
      {...{
        items,
        getInventoryItems,
        quantities,
        pageDetails,
        setPageDetails,
        totalItems,
        filters,
        setFilters,
        loading,
      }}
    />
  );
}

Inventory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
