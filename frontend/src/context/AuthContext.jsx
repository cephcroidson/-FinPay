import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => localStorage.getItem("finpay_token")
    );

    const [userEmail, setUserEmail] = useState(
        () => localStorage.getItem("finpay_user_email")
    );

    const isAuthenticated = Boolean(token);

    async function login(email, password) {
        const data = await loginRequest(email, password);

        localStorage.setItem("finpay_token", data.token);
        localStorage.setItem("finpay_user_email", email);

        setToken(data.token);
        setUserEmail(email);

        return data;
    }

    function logout() {
        localStorage.removeItem("finpay_token");
        localStorage.removeItem("finpay_user_email");

        setToken(null);
        setUserEmail(null);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("finpay_token");

        if (!storedToken) {
            setToken(null);
        }
    }, []);

    const value = {
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

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
