import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "@/components/hocs/axiosInstance";
import UsersTable from "@/components/users/users-table";
import { setOperators } from "@/store/slices/operatorsSlice";
import AdminPageGuard from "@/components/auth/admin-page-guard";
import Plans from "@/components/plans/plans";
import { toast } from "react-toastify";
import FeaturesModal from "@/components/plans/features-modal";

export default function Subscription() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const user = useSelector((state) => state.user.user);


  const getPlans = async () => {
    setLoading(true);
    const url = `${BASE_URL}/api/plans/getPlans`;
    try {
      const res = await axiosInstance.get(`${url}`);
      setPlans(res.data.result);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPlans();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <Plans {...{ plans, user }} />;
}

Subscription.getLayout = function getLayout(page) {
  return (
    <Layout>
      <AdminPageGuard>{page}</AdminPageGuard>
    </Layout>
  );
};
