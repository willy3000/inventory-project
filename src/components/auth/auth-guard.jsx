"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constants";
import axiosInstance from "../hocs/axiosInstance";
import { setRole } from "@/store/slices/roleSlice";
import { setPermissions } from "@/store/slices/permissionsSlice";
import { setSubscription } from "@/store/slices/subscriptionSlice";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUserRole = async (user) => {
    const url = `${BASE_URL}/api/auth/getUserRole`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.operatorId}`);
      dispatch(setRole(res.data.result.role));
    } catch (err) {
      alert(err.message);
    }
  };
  const getSubscriptionPlan = async (user) => {
    const url = `${BASE_URL}/api/plans/getSubscriptionPlanById`;
    try {
      const res = await axiosInstance.get(`${url}/${user?.userId}`);
      if (res) {
        dispatch(setSubscription(res.data.result));
      } else {
        dispatch(setSubscription({ planId: "pl_000", planName: "Free" }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getPermissions = async (user) => {
    const url = `${BASE_URL}/api/operators/getPermissions`;
    try {
      const res = await axiosInstance.get(
        `${url}/${user?.userId}/${user?.operatorId}`
      );
      dispatch(setPermissions(res.data.result));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user")); // Check if the user exists in localStorage

      console.log('user is', user)

      if (!user) {
        router.push("/authentication"); // Redirect to login if user is not found
      } else {
        getUserRole(user);
        getPermissions(user);
        getSubscriptionPlan(user);
        dispatch(setUser(user));
        setIsAuthenticated(true); // Set user as authenticated if found
      }
    }
  }, [router]);

  return isAuthenticated ? children : null;
}
