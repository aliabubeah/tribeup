const BASEURL = "http://tribeup.runasp.net/api/Authentication";

export async function loginAPI(data) {
    const res = await fetch(`${BASEURL}/Login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const loginData = await res.json();
    console.log(loginData);

    if (!res.ok) {
        let errorMessage = "Login failed";

        // ✅ 401 Unauthorized
        if (loginData.Message) {
            errorMessage = loginData.Message;
        }

        // ✅ 400 Validation error
        else if (Array.isArray(loginData.errors)) {
            errorMessage = loginData.errors
                .map(err => err.errors)
                .flat()
                .join(", ");
        }

        return {
            error: errorMessage,
            statusCode: res.status,
        };
    }

    return loginData;
}

export async function registerAPI(data) {
    const res = await fetch(`${BASEURL}/Register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const registerdata = await res.json();

    if (!res.ok) {
        let errors = [];

        if (Array.isArray(registerdata.Errors)) {
            errors = registerdata.Errors.map(err => err).flat();
        } else if (registerdata.Message) {
            errors = registerdata.Message;
        }

        return {
            errors: errors,
            status: res.status,
        };
    }

    return registerdata;
}
