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
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* left panel */}
            <div className="hidden items-center bg-tribe-600 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <h1 className="mb-4 text-6xl font-semibold">
                        Welcome back to your community
                    </h1>
                    <p className="text-xl tracking-wide">
                        Your tribes are waiting for you. Continue connecting,
                        sharing, and growing together.
                    </p>
                </div>
            </div>
            <div className="flex min-h-screen w-full items-center justify-center px-6 lg:w-1/2">
                <Form
                    method="POST"
                    className="flex w-full max-w-sm flex-col gap-4"
                >
                    {actionData?.error && (
                        <p className="text-sm text-red-600">
                            {actionData.error}
                        </p>
                    )}
                    <div className="w-full">
                        <h1 className="text-center text-3xl font-bold text-tribe-600 lg:text-4xl">
                            TribeUp
                        </h1>
                    </div>
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
                    <button className="w-fit border-b-2 border-neutral-700 text-left text-sm font-semibold text-neutral-700">
                        Forget password?
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-tribe-500 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Login...." : "login"}
                    </button>
                    <Link
                        to="/register"
                        className="rounded-md border-2 border-neutral-800 py-3 text-center text-sm font-semibold text-neutral-800"
                    >
                        Create an account
                    </Link>
                </Form>
            </div>
        </div>
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
