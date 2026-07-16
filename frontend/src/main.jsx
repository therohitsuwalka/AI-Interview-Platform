import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,

        style: {
          background: "#0F172A",
          color: "#fff",
          border: "1px solid #334155",
          borderRadius: "12px",
        },

        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: "#fff",
          },
        },

        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
        },
      }}
    />

  </StrictMode>
);