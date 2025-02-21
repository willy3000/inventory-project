"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/store/slices/roleSlice";

export default function ItemAssignGuard({ children }) {
  const [canEdit, setCanEdit] = useState(false);
  const permissions = useSelector((state) => state.permissions.permissions);

  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (permissions?.canAssignItems) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [permissions]);

  return canEdit ? children : null;
}
