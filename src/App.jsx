import { useEffect, useState } from "react";
import Login, { action as loginAction } from "./features/auth/Login";
import Register, { action as registerAction } from "./features/auth/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "./features/feed/Feed";
import AppLayout from "./ui/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./ui/ProtectedRoute";
import Profile from "./features/profile/Profile";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <Feed />,
                    </ProtectedRoute>
                ),
            },
            {
                path: "login",
                element: <Login />,
                action: loginAction,
            },
            {
                path: "register",
                element: <Register />,
                action: registerAction,
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />,
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
