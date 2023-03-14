import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import createAppStore from "./store";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");
export const { persistor, store } = createAppStore();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={ruRU}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
