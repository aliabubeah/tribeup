// import { useState } from "react";
import {
    Form,
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
    const { isAuthenticated, setUser } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
        if (actionData?.fullName) {
            setUser(actionData);
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, setUser, actionData, navigate]);

    return (
        <div>
            <Form method="POST">
                {actionData?.error && (
                    <p style={{ color: "red" }}>{actionData.error}</p>
                )}
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter Email..."
                    required
                />
                <br></br>
                <br></br>
                <label>Password:</label>
                <input
                    type="text"
                    name="password"
                    placeholder="Password.."
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting.state ? "loggingin..." : "login"}
                </button>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = await loginAPI(data);

    if (result.error) {
        return result;
    }

    localStorage.setItem("user", JSON.stringify(result));
    return result;
}

export default Login;
