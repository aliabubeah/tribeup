import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { changePasswordAPI } from "../../services/auth";
import Button from "../../ui/Button";
import AuthBrand from "./AuthBrand";

function ChangePassword() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const { accessToken } = useAuth();
    const actionData = useActionData();

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6">
            <AuthBrand />
            <Form method="POST" className="flex w-full max-w-sm flex-col gap-4">
                {actionData?.errors && (
                    <div className="space-y-1">
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
                    type="text"
                    name="currentPassword"
                    placeholder="currentPassword"
                    className="input"
                />
                <input
                    type="text"
                    name="newPassword"
                    placeholder="newPassword"
                    className="input"
                />
                <input
                    type="text"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                    className="input"
                />
                <input
                    type="hidden"
                    name="accessToken"
                    value={accessToken}
                    className="input"
                />
                <Button type="submit" disabled={isSubmitting}>
                    {!isSubmitting ? "Reset" : "ResetPassword..."}
                </Button>
            </Form>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const { currentPassword, newPassword, confirmPassword, accessToken } = data;
    const changePassword = await changePasswordAPI(
        currentPassword,
        newPassword,
        confirmPassword,
        accessToken,
    );

    if (changePassword.errors) {
        return changePassword;
    }
    return redirect("/");
}

export default ChangePassword;
