
import { useState, useEffect } from "react";

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const useAuth = () => {
    const [auth, setAuth] = useState<AuthState>({ user: null, token: null });

    useEffect(() => {
        const storedAuth = localStorage.getItem("useer");
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                setAuth(parsedAuth);
            } catch (error) {
                console.error("Error parsing auth data from localStorage:", error);
                setAuth({ user: null, token: null });
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("useer");
        setAuth({ user: null, token: null });
    };

    return { ...auth, logout };
};

export default useAuth;
