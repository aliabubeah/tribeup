import "react-loading-skeleton/dist/skeleton.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SkeletonTheme } from "react-loading-skeleton";

import { Provider } from "react-redux";
import store from "./store/store.js";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <SkeletonTheme baseColor="#e5e5e5" highlightColor="#f5f5f5">
                <StrictMode>
                    <App />
                </StrictMode>
            </SkeletonTheme>
        </QueryClientProvider>
    </Provider>,
);
