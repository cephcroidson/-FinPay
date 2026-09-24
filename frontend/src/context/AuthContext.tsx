import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { login as loginRequest } from "../api/authApi";

interface AuthContextValue {
    token: string | null;
    userEmail: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("finpay_token")
    );

    const [userEmail, setUserEmail] = useState<string | null>(
        () => localStorage.getItem("finpay_user_email")
    );

    const isAuthenticated = Boolean(token);

    async function login(
        email: string,
        password: string
    ): Promise<void> {
        const data = await loginRequest(email, password);

        if (!data?.token) {
            throw new Error("Authentication response did not contain a token.");
        }

        localStorage.setItem("finpay_token", data.token);
        localStorage.setItem("finpay_user_email", email);

        setToken(data.token);
        setUserEmail(email);
    }

    function logout(): void {
        localStorage.removeItem("finpay_token");
        localStorage.removeItem("finpay_user_email");

        setToken(null);
        setUserEmail(null);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("finpay_token");

        if (!storedToken) {
            setToken(null);
            setUserEmail(null);
        }
    }, []);

    useEffect(() => {
        function handleUnauthorized(): void {
            logout();
        }

        window.addEventListener(
            "finpay:unauthorized",
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                "finpay:unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    const value: AuthContextValue = {
        token,
        userEmail,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
