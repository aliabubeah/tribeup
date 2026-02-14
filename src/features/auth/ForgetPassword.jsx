import { useState } from "react";
import Button from "../../ui/Button";
import { forgetPasswordAPI } from "../../services/auth";
import { Link, useNavigation } from "react-router-dom";
import AuthBrand from "./AuthBrand";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [issent, setIsSent] = useState(false);
    const isDisabled = email.trim().length === 0;

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await forgetPasswordAPI(email);
        if (result.ok) setIsSent(true);
    }

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* left panel */}
            <div className="hidden items-center bg-tribe-600 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <h1 className="mb-4 text-6xl font-semibold">
                        {!issent ? "Forgot your password?" : "Check your email"}
                    </h1>
                    <p className="text-xl tracking-wide">
                        {!issent
                            ? "No worries! Enter your email address and well send you instructions to reset your password"
                            : "We've sent you instructions to reset your password. Follow the link in the email to create a new password."}
                    </p>
                </div>
            </div>

            <div className="flex min-h-screen w-full items-center justify-center px-6 lg:w-1/2">
                {!issent ? (
                    <form
                        method="POST"
                        className="flex w-full max-w-sm flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <AuthBrand />
                        <input
                            type="email"
                            className="input h-11"
                            placeholder="Email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button type="submit" disabled={isDisabled}>
                            {!isSubmitting ? "Send" : "Sending..."}
                        </Button>
                        <Button to="/auth/login">Back to Login</Button>
                    </form>
                ) : (
                    <div className="flex flex-col justify-center gap-6 text-center">
                        <div className="flex flex-col gap-2">
                            <span className="icon-outlined w-fit self-center rounded-full bg-tribe-500 p-4 text-6xl text-white">
                                mail
                            </span>
                            <h1 className="mb-1 text-2xl font-bold tracking-wide md:text-3xl">
                                Email sent
                            </h1>
                            <p>
                                Weve sent password reset instructions to
                                <span className="block font-semibold">
                                    {email}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button to="/auth/login">Back to login </Button>
                            <Button onClick={(e) => setIsSent(false)}>
                                resend Email
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgetPassword;
