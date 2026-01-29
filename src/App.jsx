import Login, { action as loginAction } from "./features/auth/Login";
import Register, { action as registerAction } from "./features/auth/Register";
import ResetPassword, {
    action as resetAction,
} from "./features/auth/ResetPassword";
import ChangePassword, {
    action as changePasswordAction,
} from "./features/auth/ChangePassword";
import ForgetPassword from "./features/auth/ForgetPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "./features/feed/Feed";
import AppLayout from "./ui/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./ui/ProtectedRoute";
import Profile from "./features/profile/Profile";
import Error from "./ui/Error";
import Settings from "./features/settings/Settings";
import Account from "./features/settings/Account";
import Privacy from "./features/settings/Privacy";
import Avatar from "./features/settings/Avatar";
import About from "./features/settings/About";
import AuthLayout from "./features/auth/AuthLayout";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
    {
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        errorElement: <Error />,
        children: [
            {
                index: true,
                path: "/",
                element: <Feed />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            { path: "settings/account", element: <Account /> },
            { path: "settings/privacy", element: <Privacy /> },
            { path: "avatar", element: <Avatar /> },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "/auth/change-password",
                element: <ChangePassword />,
                action: changePasswordAction,
            },
        ],
    },
    {
        element: <AuthLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/auth/login",
                element: <Login />,
                action: loginAction,
            },
            {
                path: "/auth/register",
                element: <Register />,
                action: registerAction,
            },
            {
                path: "/auth/forgetpassword",
                element: <ForgetPassword />,
            },
        ],
    },
]);

function App() {
    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        fontSize: "14px",
                    },
                }}
            />
        </>
    );
}

export default App;
