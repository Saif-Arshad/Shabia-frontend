import { useState, useEffect } from "react";

const useAuth = () => {
    const [auth, setAuth] = useState({ user: null, token: null });
    console.log("🚀 ~ useAuth ~ auth:", auth)

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

    return auth;
};

export default useAuth;
