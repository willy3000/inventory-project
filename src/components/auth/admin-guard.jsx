"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/store/slices/roleSlice";

export default function AdminGuard({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const role = useSelector((state) => state.role.role);

  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [role]);

  return isAdmin ? children : null;
}
