import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { Provider } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <SkeletonTheme baseColor="#e5e5e5" highlightColor="#f5f5f5">
            <StrictMode>
                <App />
            </StrictMode>
        </SkeletonTheme>
    </Provider>,
);
