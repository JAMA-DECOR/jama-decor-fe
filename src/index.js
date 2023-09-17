import viVN from "antd/locale/vi_VN";
import ReactDOM from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { router } from "./router";
import "./assets/styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<RouterProvider router={router}>
		<ConfigProvider locale={viVN}>
			{/* More Wrappers or Providers */}
		</ConfigProvider>
	</RouterProvider>
);
