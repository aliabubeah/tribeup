import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react";
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
        case "authenticate":
            setHttpToken(action.payload.accessToken);

            return {
                user: action.payload.userSummary,
                accessToken: action.payload.accessToken,
                isAuthenticated: true,
                isLoading: false,
            };

        case "logout":
            localStorage.removeItem("refreshToken");
            clearAccessToken();

            return {
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            };

        case "finishLoading":
            return { ...state, isLoading: false };

        default:
            throw new Error("Unknown action");
    }
}

function AuthProvider({ children }) {
    const hasHydrated = useRef(false);

    const [{ user, accessToken, isAuthenticated, isLoading }, dispatch] =
        useReducer(reducer, initialState);

    /**
     * Called after login success
     */
    function setAccessToken(response) {
        if (!response?.accessToken || !response?.refreshToken) return;

        localStorage.setItem("refreshToken", response.refreshToken);

        dispatch({
            type: "authenticate",
            payload: response,
        });
    }

    function logout() {
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
                const response = await refreshAPI(refreshToken);

                localStorage.setItem("refreshToken", response.refreshToken);

                dispatch({
                    type: "authenticate",
                    payload: response,
                });
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
                accessToken,
                isAuthenticated,
                isLoading,
                setAccessToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export { AuthProvider, useAuth };
