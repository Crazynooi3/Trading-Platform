import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppContainer from "./ReduxConfig/AppContainer.jsx";

import "./index.css";
import Router from "./routes/routes.jsx";

createRoot(document.getElementById("root")).render(
  <AppContainer>
    <Router />
  </AppContainer>,
);
