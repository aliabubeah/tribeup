const BASEURL = "http://tribeup.runasp.net/api/Authentication";

export async function login(data) {
    const res = await fetch(`${BASEURL}/Login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw Error("Login Failed");

    const loginData = await res.json();
    console.log(loginData);
}

export async function register(data) {
    const res = await fetch(`${BASEURL}/Register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw Error("Register Failed");

    const registerdata = await res.json();
    console.log("success");
    console.log(registerdata);
}
