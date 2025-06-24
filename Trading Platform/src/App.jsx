import { useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./routes";
import "./App.css";

function App() {
  const router = useRoutes(routes);
  return (
    <>
      <></>
      {router}
    </>
  );
}

export default App;
