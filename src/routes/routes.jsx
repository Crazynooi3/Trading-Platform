import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavLayout from "../Components/NavLayout/NavLayout";
import Splash from "../Pages/Splash";
import Trade from "../Pages/Trade";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route element={<NavLayout />}>
          <Route path="trade" element={<Trade />} />
          <Route path="trade/:base/:quote" element={<Trade />} />
        </Route>
      </Routes>
    </Router>
  );
}
