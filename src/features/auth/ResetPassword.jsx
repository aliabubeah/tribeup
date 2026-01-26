import { Form, useNavigation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { resetPasswordAPI } from "../../services/auth";
import Button from "../../ui/Button";

function ResetPassword() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    console.log(isSubmitting);
    const { accessToken } = useAuth();
    return (
        <div>
            <Form method="POST" className="flex flex-col gap-3">
                <input
                    type="password"
                    name="currentpassword"
                    placeholder="currentPassword"
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="newPassword"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                />
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
    console.log(data);
    // const { email, newPassword, confirmPassword } = data;
    // const result = await resetPasswordAPI(email, newPassword, confirmPassword);

    // console.log(result);

    return null;
}
export default ResetPassword;
