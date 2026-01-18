import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react";
import { getprofile } from "../services/profile";
import { refreshAPI } from "../services/auth";
import {
    clearAccessToken,
    setAccessToken as setHttpToken,
} from "../services/http";

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
            setHttpToken(action.payload);
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

    // Handle Login
    async function handleLogin(accessToken) {
        setHttpToken(accessToken);

        dispatch({ type: "login", payload: accessToken });

        const profile = await getprofile();
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
        clearAccessToken();
        dispatch({ type: "logout" });
    }

    useEffect(() => {
        if (hasHydrated.current) return;
        hasHydrated.current = true;

        async function hydrate() {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                dispatch({ type: "finishLoading" });
                return;
            }

            try {
                const { accessToken, refreshToken: newRefresh } =
                    await refreshAPI(refreshToken);

                localStorage.setItem("refreshToken", newRefresh);

                await handleLogin(accessToken);
            } catch {
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
