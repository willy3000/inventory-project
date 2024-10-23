import React, { useState, useEffect } from "react";
import Layout from "../../dashboard";
import EmployeesTable from "@/components/employees/employees-table";
import LoadingIndicator from "@/components/hocs/LoadingIndicator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/store/slices/itemsSlice";
import { setEmployees } from "@/store/slices/employeesSlice";
import { BASE_URL } from "@/utils/constants";

export default function Employees() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const user = useSelector((state) => state.user.user);

  const getEmployees = async () => {
    const url = `${BASE_URL}/api/employees/getEmployees`;
    console.log("fetching employees");
    try {
      const res = await axios.get(`${url}/${user?.userId}`);
      console.log("dipatching", res.data.result);
      dispatch(setEmployees(res.data.result));
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <EmployeesTable {...{ employees, getEmployees }} />;
}

Employees.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
