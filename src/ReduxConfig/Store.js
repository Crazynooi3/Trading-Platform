import { configureStore } from "@reduxjs/toolkit";
import marketsDatasReducer from "./entities/marketDatas";
import marketOrderReducer from "./entities/marketOrderbook";
import symbolIDPrecisionReducer from "./entities/symbolIDPerecision";
import webSocketReducer from "./entities/webSocket";

export default configureStore({
  reducer: {
    marketsDatas: marketsDatasReducer,
    marketOrderbook: marketOrderReducer,
    symbolIDPrecision: symbolIDPrecisionReducer,
    webSocketMessage: webSocketReducer,
  },
});
