
import { useState, useEffect } from "react";

// Mock user data - in a real app this would come from authentication service
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  id: "user-123"
};

const useAuth = () => {
    const [auth, setAuth] = useState({ user: mockUser, token: "mock-token" });

    useEffect(() => {
        const storedAuth = localStorage.getItem("useer");
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                setAuth(parsedAuth);
            } catch (error) {
                console.error("Error parsing auth data from localStorage:", error);
                // Fallback to the mock user if there's an error
                setAuth({ user: mockUser, token: "mock-token" });
            }
        }
    }, []);

    return auth;
};

export default useAuth;
