import Index from "./Pages/Index";
import Trading from "./Pages/Trading";

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/trade",
    element: <Trading />,
  },
];

export default routes;
