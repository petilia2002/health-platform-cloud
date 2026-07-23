import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp, ConfigProvider } from "antd";
import { theme } from "./themes.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
);
