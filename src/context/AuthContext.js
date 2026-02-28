import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
    }, []);

    function loginWithToken(newToken) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    }

    function logout() {
        setToken(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated: Boolean(token), loginWithToken, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}