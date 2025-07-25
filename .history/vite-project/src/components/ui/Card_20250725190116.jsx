import React from "react";

export function Card({ children, className = "", ...props }) {
  return <div className={`rounded-lg border bg-white p-4 shadow ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}
