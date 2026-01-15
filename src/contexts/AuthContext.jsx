import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case "logout":
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case "finishLoading":
            return {
                ...state,
                isLoading: false,
            };
        default:
            throw new Error("unkown Action");
    }
}

function AuthProvider({ children }) {
    const [{ user, isAuthenticated, isLoading }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") {
            dispatch({ type: "finishLoading" });
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            dispatch({ type: "login", payload: parsedUser });
        } catch {
            localStorage.removeItem("user");
            dispatch({ type: "finishLoading" });
        }
    }, []);

    function setUser(user) {
        if (!user) return;

        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "login", payload: user });
    }

    function logout() {
        localStorage.removeItem("user");
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider
            value={{ user, setUser, logout, isAuthenticated, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("out of context block");
    return context;
}

export { useAuth, AuthProvider };
