import React, { useState, useEffect } from "react";
import Layout from "./dashboard";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
      <p className="text-2xl text-gray-300 mb-8">Oops! Page not found</p>
      <div className="w-24 h-24 mb-8">
        <img
          src="/images/404.png"
          alt="404 Icon"
          className="w-full h-full object-contain opacity-40"
        />
      </div>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => router.push("dashboard/inventory")}
        className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2"
      >
        <i className="fas fa-home"></i>
        <span>Go to Inventory</span>
      </button>
    </div>
  );
}

NotFound.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
