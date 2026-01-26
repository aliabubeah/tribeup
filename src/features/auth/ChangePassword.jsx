import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { changePasswordAPI, resetPasswordAPI } from "../../services/auth";
import Button from "../../ui/Button";

function ChangePassword() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const { accessToken } = useAuth();
    const actionData = useActionData();

    return (
        <div>
            <Form method="POST" className="flex flex-col gap-3">
                {actionData?.error && (
                    <p className="text-sm text-red-600">{actionData.error}</p>
                )}
                <input
                    type="text"
                    name="currentPassword"
                    placeholder="currentPassword"
                />
                <input
                    type="text"
                    name="newPassword"
                    placeholder="newPassword"
                />
                <input
                    type="text"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                />
                <input type="hidden" name="accessToken" value={accessToken} />
                <Button type="submit" disabled={isSubmitting}>
                    {!isSubmitting ? "Submit" : "ResetPassword..."}
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

    if (changePassword.error) {
        return changePassword;
    }
    
    return redirect("/");
}

export default ChangePassword;
