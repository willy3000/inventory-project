"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";


export default function AuthGuard({ children}) {
  const router = useRouter();
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("guard executed");

  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user")); // Check if the user exists in localStorage

      if (!user) {
        router.push("/authentication"); // Redirect to login if user is not found
      } else {
        dispatch(setUser(user));
        setIsAuthenticated(true); // Set user as authenticated if found
      }
    }
  }, [router]);

  return isAuthenticated ? children : null;
}
