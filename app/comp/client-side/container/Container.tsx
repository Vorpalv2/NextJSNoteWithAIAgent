"use client";
import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-10 flex gap-4 p-8 min-h-screen bg-amber-100 rounded-2xl">
      {children}
    </div>
  );
};

export default Container;
