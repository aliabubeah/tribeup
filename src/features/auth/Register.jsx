import {
    Form,
    Link,
    redirect,
    useActionData,
    useNavigation,
} from "react-router-dom";
import { registerAPI } from "../../services/auth";

function Register() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* left panel */}
            <div className="hidden items-center bg-tribe-600 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <h1 className="mb-4 text-6xl font-semibold">
                        Start your journey,
                    </h1>
                    <h1 className="mb-4 text-6xl font-semibold">
                        join your tripes
                    </h1>
                    <p className="text-xl tracking-wide">
                        Create your account and discover tripes that match your
                        interests, passions, and goals.
                    </p>
                </div>
            </div>
            <div className="flex min-h-screen w-full items-center justify-center px-6 lg:w-1/2">
                <Form
                    method="POST"
                    className="flex w-full max-w-sm flex-col gap-4"
                >
                    {actionData?.errors &&
                        actionData.errors.map((err, i) => (
                            <p style={{ color: "red" }} key={i}>
                                {err}
                            </p>
                        ))}
                    <div className="w-full">
                        <h1 className="text-center text-3xl font-bold tracking-wide text-tribe-600 lg:text-4xl">
                            TribeUp
                        </h1>
                    </div>
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
                        type="text"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-tribe-500 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "submitting" : "Create account"}
                    </button>
                    <Link
                        to="/login"
                        className="rounded-md border-2 border-neutral-800 py-3 text-center text-sm font-semibold text-neutral-800"
                    >
                        Already have account
                    </Link>
                </Form>
            </div>
        </div>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = await registerAPI(data);
    console.log(result);
    if (result.errors) {
        return result;
    }

    return redirect("/login");
}
export default Register;
