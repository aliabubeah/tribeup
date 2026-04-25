import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";

import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
