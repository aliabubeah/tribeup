import { useState } from "react";
import Button from "../../ui/Button";
import { forgetPasswordAPI } from "../../services/auth";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [check, setCheck] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await forgetPasswordAPI(email);
        console.log(result);
        if (result.ok) setCheck(true);
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="">
                <form method="Post" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="input h-11"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {check && (
                        <p className="bg-green-700 p-2 font-semibold text-neutral-900">
                            Check Your email
                        </p>
                    )}
                    <Button type="submit" className="px-2">
                        submit
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
