import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import UsersTable from "@/components/users/users-table";
import { setOperators } from "@/store/slices/operatorsSlice";
import AdminPageGuard from "@/components/auth/admin-page-guard";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const operators = useSelector((state) => state.operators.operators);
  const user = useSelector((state) => state.user.user);

  const getInventoryOperators = async () => {
    const url = `${BASE_URL}/api/operators/getInventoryOperators`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      dispatch(setOperators(res.data.result));
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInventoryOperators();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <UsersTable {...{ operators, getInventoryOperators, loading }} />;
}

Users.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AdminPageGuard>{page}</AdminPageGuard>
    </Layout>
  );
};
