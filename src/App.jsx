import { useEffect, useState } from "react";
import { register } from "./services/auth";

function App() {
    const test = {
        firstName: "string",
        lastName: "string",
        userName: "string",
        email: "user@example.com",
        phoneNumber: "string",
        profilePicture: "string",
        avatar: "string",
        password: "string",
        confirmPassword: "string",
    };

    useEffect(() => {
        const test = {
            firstName: "string",
            lastName: "string",
            userName: "string",
            email: "user@example.com",
            phoneNumber: "string",
            profilePicture: "string",
            avatar: "string",
            password: "string",
            confirmPassword: "string",
        };
        async function testApi() {
            await register(test);
        }

        testApi();
    }, []);

    return <h1>hello world</h1>;
}

export default App;
