import { Link, useRouteError } from "react-router-dom";

function NotFound() {
    const error = useRouteError();
    console.log(error);
    return (
        <div
            style={{
                width: "100%",
                padding: "2rem",
                textAlign: "center",
            }}
        >
            <h1>404 - Page Not Found</h1>
            <p>
                {error?.data ||
                    error?.message ||
                    "The page does not exist."}
            </p>

            <Link to="/">Go back home</Link>
        </div>
    );
}

export default NotFound;
