import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Utilities/queryClient.js";
import AppContainer from "./ReduxConfig/AppContainer.jsx";
import Router from "./routes/routes.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <AppContainer>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </AppContainer>,
);
