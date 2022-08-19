import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import createAppStore from "./store";
import { ConfigProvider } from "antd";
import ruRU from "antd/es/locale/ru_RU";
import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");
export const { persistor, store } = createAppStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={ruRU}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
