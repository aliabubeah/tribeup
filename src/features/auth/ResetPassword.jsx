import {
    Form,
    redirect,
    useActionData,
    useNavigation,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { resetPasswordAPI } from "../../services/auth";
import Button from "../../ui/Button";
import Auth from "./Auth";
import AuthBrand from "./AuthBrand";

function ResetPassword() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const [searhParams] = useSearchParams();

    const email = searhParams.get("email");
    const token = searhParams.get("token");

    const isSubmitting = navigation.state === "submitting";

    return (
        <Auth
            leftDescription="Enter new password to rest, if you remembered your previous password click on remembered my password."
            leftTitle="Enter new password"
        >
            <AuthBrand />
            {actionData?.errors && (
                <div>
                    {Object.values(actionData.errors)
                        .flat()
                        .map((msg, i) => (
                            <p key={i} className="text-sm text-red-600">
                                • {msg}
                            </p>
                        ))}
                </div>
            )}
            <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className="input"
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="input"
            />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={token} />

            <Button type="submit" disabled={isSubmitting}>
                {!isSubmitting ? "Reset" : "Resetting..."}
            </Button>
            <Button to="/auth/login">Back to login</Button>
        </Auth>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const { newPassword, confirmPassword, email, token } = data;

    const resetPassword = await resetPasswordAPI(
        token,
        email,
        newPassword,
        confirmPassword,
    );

    if (resetPassword.errors) {
        return resetPassword;
    }

    return redirect("/auth/login");
}
export default ResetPassword;
