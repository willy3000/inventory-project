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
import LogsTable from "@/components/logs/logs-table";
import { setLogs } from "@/store/slices/logsSlice";
import AdminPageGuard from "@/components/auth/admin-page-guard";

export default function ItemGroup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { itemGroupId } = router.query;
  const logs = useSelector((state) => state.logs.logs);
  const user = useSelector((state) => state.user.user);
  const [itemGroup, setItemGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageDetails, setPageDetails] = useState({
    page: 1,
    limit: 5,
  });
  const [totalItems, setTotalItems] = useState(1);

  const getLogs = async () => {
    const url = `${BASE_URL}/api/logs/getLogs`;
    const queryString = `page=${pageDetails.page}&limit=${pageDetails.limit}`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setLogs(res.data.result));
      //   setTotalItems(res.data.totalItems);
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    getLogs();
  }, []);

  console.log("logs", logs);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <LogsTable
      {...{
        items: logs,
        getLogs,
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
  return (
    <Layout>
      <AdminPageGuard>{page}</AdminPageGuard>
    </Layout>
  );
};
