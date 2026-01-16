import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react";
import { getprofile } from "../services/profile";
import { refreshAPI } from "../services/auth";

const AuthContext = createContext();

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                accessToken: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case "setUser":
            return {
                ...state,
                user: action.payload,
            };
        case "logout":
            localStorage.removeItem("refreshToken");
            return {
                user: null,
                accessToken: null,
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
    const hasHydrated = useRef(false);

    const [{ user, isAuthenticated, isLoading, accessToken }, dispatch] =
        useReducer(reducer, initialState);

    async function handleLogin(accessToken) {
        dispatch({ type: "login", payload: accessToken });

        const profile = await getprofile(accessToken);
        dispatch({ type: "setUser", payload: profile });
    }

    // login first time (if user doesn't exist )
    async function setAccessToken(token) {
        if (!token.accessToken || !token.refreshToken) return;

        localStorage.setItem("refreshToken", token.refreshToken);

        await handleLogin(token.accessToken);
    }

    function setUser(user) {
        dispatch({ type: "setUser", payload: user });
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    // Checks if user exist
    useEffect(() => {
        if (hasHydrated.current) return;
        hasHydrated.current = true;

        async function hydrate() {
            const refreshToken = localStorage.getItem("refreshToken");

            if (
                !refreshToken ||
                refreshToken === "undefined" ||
                refreshToken === "null"
            ) {
                localStorage.removeItem("refreshToken");
                dispatch({ type: "finishLoading" });
                return;
            }

            try {
                const response = await refreshAPI(refreshToken);

                if (response.refreshToken) {
                    localStorage.setItem("refreshToken", response.refreshToken);
                }

                await handleLogin(response.accessToken);
            } catch (err) {
                console.error(err);
                localStorage.removeItem("refreshToken");
                dispatch({ type: "finishLoading" });
            }
        }

        hydrate();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setAccessToken,
                logout,
                isAuthenticated,
                isLoading,
                accessToken,
            }}
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
