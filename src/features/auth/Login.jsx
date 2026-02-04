import {
    Form,
    Link,
    useActionData,
    useNavigate,
    useNavigation,
} from "react-router-dom";
import { loginAPI } from "../../services/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import Button from "../../ui/Button";
import Auth from "./Auth";
import AuthBrand from "./AuthBrand";

function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === "submitting";
    const { isAuthenticated, setAccessToken, accessToken } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }

        if (actionData?.accessToken) {
            setAccessToken(actionData);
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, setAccessToken, actionData, navigate, accessToken]);

    return (
        <Auth
            leftDescription="Your tribes are waiting for you. Continue connecting,sharing, and growing together."
            leftTitle="Welcome back to your community"
        >
            <AuthBrand />
            {actionData?.message && (
                <p className="text-sm text-red-600">{actionData.message}</p>
            )}
            <div className="mt-2 flex flex-col gap-3">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="input"
                />
                <Link
                    to="/auth/forgetpassword"
                    className="mt-1 w-fit border-b-2 border-neutral-700 text-left text-sm font-semibold text-neutral-700"
                >
                    Forget password?
                </Link>
            </div>
            <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Login...." : "login"}
                </Button>
                <Button to="/auth/register">Create an account</Button>
            </div>
        </Auth>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = await loginAPI(data);
    console.log(result);
    if (result.error) {
        return result;
    }

    localStorage.setItem("refreshToken", JSON.stringify(result.refreshToken));
    return result;
}

export default Login;
