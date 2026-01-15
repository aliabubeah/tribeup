import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { registerAPI } from "../../services/auth";

function Register() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <div>
            <div>
                <Form method="POST">
                    {actionData?.errors &&
                        actionData.errors.map((err, i) => (
                            <p style={{ color: "red" }} key={i}>
                                {err}
                            </p>
                        ))}
                    <label>FirstName</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Enter FirstName..."
                        required
                    />
                    <label>lastName:</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="enter lastName"
                        required
                    />
                    <br></br>
                    <br></br>
                    <label>userName:</label>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Enter userName..."
                        required
                    />
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter email..."
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="text"
                        name="password"
                        placeholder="Password.."
                        required
                    />
                    <label>Confirm Password:</label>
                    <input
                        type="text"
                        name="confirmPassword"
                        placeholder="Confirm Password.."
                        required
                    />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "submitting" : "signup"}
                    </button>
                </Form>
            </div>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = await registerAPI(data);

    if (result.errors) {
        return result;
    }

    return redirect("/login");
}
export default Register;
