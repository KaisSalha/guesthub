import React from "react";

export const BouncingDotsLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-1.5">
      <div
        className="w-1 h-1 rounded-full bg-background opacity-100 animate-bouncing-loader"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-1 h-1 rounded-full bg-background opacity-100 animate-bouncing-loader"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-1 h-1 rounded-full bg-background opacity-100 animate-bouncing-loader"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};
