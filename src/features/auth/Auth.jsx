import { Form } from "react-router-dom";

function Auth({ leftTitle, leftDescription, children, formMethod = "post" }) {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* Left Panel */}
            <div className="hidden items-center bg-tribe-600 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <h1 className="mb-4 text-6xl font-semibold">{leftTitle}</h1>
                    <p className="text-xl tracking-wide">{leftDescription}</p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex min-h-screen w-full items-center justify-center px-6 lg:w-1/2">
                <Form
                    method={formMethod}
                    className="flex w-full max-w-sm flex-col gap-6"
                >
                    {children}
                </Form>
            </div>
        </div>
    );
}

export default Auth;
