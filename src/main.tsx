import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Routes from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { App } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <Provider store={store}>
        <Routes />
      </Provider>
    </App>
  </StrictMode>
);
