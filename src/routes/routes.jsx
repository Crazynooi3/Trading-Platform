import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import NavLayout from "../Components/NavLayout/NavLayout";
import Splash from "../Pages/Splash";
import Trade from "../Pages/Trade";
import React from "react";
import { useDispatch } from "react-redux";
import { addToken, clearToken } from "../ReduxConfig/entities/userToken";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route
          element={
            <Auth>
              <NavLayout />
            </Auth>
          }>
          <Route path="trade" element={<Trade />} />
          <Route path="trade/:base/:quote" element={<Trade />} />
        </Route>
      </Routes>
    </Router>
  );
}

const Auth = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  if (!token) dispatch(clearToken());
  React.useEffect(() => {
    dispatch(addToken(token));
  });
  return <Outlet />;
};
