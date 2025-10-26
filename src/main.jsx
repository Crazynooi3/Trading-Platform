import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Utilities/queryClient.js";
import { ToastContainer } from "react-toastify";
import AppContainer from "./ReduxConfig/AppContainer.jsx";
import Router from "./routes/routes.jsx";

import "./index.css";
import "react-toastify/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <AppContainer>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ToastContainer
        position="top-center" // موقعیت toast (top-right, bottom-right, etc.)
        autoClose={5000} // خودکار بسته بشه بعد از ۵ ثانیه
        hideProgressBar={true}
        newestOnTop={false}
        closeButton={false}
        closeOnClick
        rtl={true} // برای RTL (فارسی)
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
    </QueryClientProvider>
  </AppContainer>,
);
