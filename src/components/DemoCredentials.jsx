"use client";
import React, { useState } from "react";

const DemoCredentials = ({ position = "bottom" }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1200);
  };

  const CopyItem = ({ label, value }) => (
    <button
      onClick={() => copyText(value)}
      className="block w-full text-left cursor-pointer text-blue-600 hover:underline"
    >
      {label}:{" "}
      <span className="font-medium">
        {value}
        {copied === value && (
          <span className="ml-2 text-xs text-green-600">Copied!</span>
        )}
      </span>
    </button>
  );

  return (
    <>
      {/* Trigger Button (can be anywhere) */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg cursor-pointer bg-primary px-4 py-4 text-sm font-medium text-white hover:bg-primary/80"
      >
        View Demo Credentials
      </button>

      {/* Fixed Modal */}
      {open && (
        <div
          className={`fixed left-1/2 z-50 w-80 -translate-x-1/2 rounded-xl border bg-white p-4 shadow-lg
            ${position === "top" ? "top-6" : "bottom-6"}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Demo Credentials
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Admin */}
          <div className="text-sm space-y-1 mb-3">
            <p className="font-medium text-gray-600">Admin</p>
            <CopyItem label="Email" value="test@gmail.com" />
            <CopyItem label="Password" value="123456Aa!" />
          </div>

          <hr className="my-2" />

          {/* User */}
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-600">User</p>
            <CopyItem label="Email" value="shanto@mia.com" />
            <CopyItem label="Password" value="123456" />
          </div>
        </div>
      )}
    </>
  );
};

export default DemoCredentials;
