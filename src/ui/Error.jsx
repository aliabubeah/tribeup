import { Link, useRouteError } from "react-router-dom";

function Error() {
    const error = useRouteError();
    return (
        <div
            style={{
                width: "100%",
                padding: "2rem",
                textAlign: "center",
            }}
        >
            {error.status === 404 && (
                <h1 className="font-semibold text-neutral-800">
                    404-page not found
                </h1>
            )}
            <p className="font-semibold text-red-500">
                {error?.data || error?.message || "The page does not exist."}
            </p>

            <Link to="/">Go back home</Link>
            <br />
            <Link to={-1}>Go to prev page</Link>
        </div>
    );
}

export default Error;
