import { redirect, useActionData, useNavigation } from "react-router-dom";
import { registerAPI } from "../../services/auth";
import Button from "../../ui/Button";
import Auth from "./Auth";
import AuthBrand from "./AuthBrand";

function Register() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <Auth
            leftDescription="Create your account and discover tripes that match your interests, passions, and goals."
            leftTitle="Start your journey"
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
            <div className="mt-2 flex flex-col gap-3">
                <div className="flex gap-3">
                    <input
                        className="input flex-1"
                        type="text"
                        name="firstName"
                        placeholder="FirstName"
                        required
                    />
                    <input
                        className="input flex-1"
                        type="text"
                        name="lastName"
                        placeholder="LastName"
                        required
                    />
                </div>
                <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    className="input"
                    type="text"
                    name="userName"
                    placeholder="user name"
                    required
                />
                <input
                    className="input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />

                <input
                    className="input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                />
            </div>
            <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "submitting" : "Create account"}
                </Button>
                <Button to="/auth/login">Already have account</Button>
            </div>
        </Auth>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = await registerAPI(data);
    if (result.errors) {
        return result;
    }

    return redirect("/auth/login");
}
export default Register;
