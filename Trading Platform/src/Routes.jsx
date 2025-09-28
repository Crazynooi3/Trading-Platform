import Index from "./Pages/Index";
import Trade from "./Pages/Trade";

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/trade",
    element: <Trade />,
  },
  {
    path: "/trade/:base/:quote",
    element: <Trade />,
  },
];

export default routes;
