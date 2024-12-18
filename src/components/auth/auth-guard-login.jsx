import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthGuardLogin({ children }) {
  const router = useRouter();


  useEffect(() => {
    // Ensure this runs only in the browser (client-side)
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"))
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return children;
}
