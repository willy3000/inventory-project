import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/dashboard";
import ItemGroupTable from "@/components/inventory/item-group-table";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { setGroupItems } from "@/store/slices/groupItemsSlice";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import NotFound from "@/pages/404";

export default function ItemGroup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { itemGroupId } = router.query;
  const groupItems = useSelector((state) => state.groupItems.groupItems);
  const user = useSelector((state) => state.user.user);
  const [itemGroup, setItemGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    limit: 5,
  });
  const [totalItems, setTotalItems] = useState(1);

  const getGroupItems = async () => {
    const url = `${BASE_URL}/api/inventory/getGroupItems`;
    const queryString = `page=${pageDetails.page}&limit=${pageDetails.limit}`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${itemGroupId}?${queryString}`
      );
      dispatch(setGroupItems(res.data.result));
      setTotalItems(res.data.totalItems);
    } catch (err) {}
  };
  const getItemGroupById = async () => {
    const url = `${BASE_URL}/api/inventory/getItemGroupById`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${itemGroupId}`
      );
      setItemGroup(res.data.result);
    } catch (err) {
      alert(err.message);
    }
    getGroupItems();
    setLoading(false);
  };

  useEffect(() => {
    getItemGroupById();
  }, []);
  useEffect(() => {
    getGroupItems();
  }, [pageDetails]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!groupItems) {
    return <NotFound />;
  }

  return (
    <ItemGroupTable
      {...{
        items: groupItems || [],
        getGroupItems,
        itemGroup,
        user,
        pageDetails,
        totalItems,
        setPageDetails,
      }}
    />
  );
}

ItemGroup.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
