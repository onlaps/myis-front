import { createStore, applyMiddleware, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";

import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import app from "./reducers/app";

const configureStore = composeWithDevTools(applyMiddleware(thunkMiddleware))(
  createStore
);

const versions = {
  app: "1",
};

const APP_NAME = "MYIS_APP";

const appPersistConfig = {
  key: `${APP_NAME}_app_${versions.app}`,
  version: versions.app,
  storage: storage,
};

const reducer = combineReducers({
  app: persistReducer(appPersistConfig, app),
});

const store = () => {
  const store = configureStore(reducer);
  const persistor = persistStore(store);

  return { persistor, store };
};

export default store;
