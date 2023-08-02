import React from "react";
import { createRoot } from "react-dom/client";

const getRoot = () => document.getElementById("root");

export const Render = (element: JSX.Element) => {
  const root = createRoot(getRoot()!);
  root.render(<React.StrictMode>{element}</React.StrictMode>);
};
