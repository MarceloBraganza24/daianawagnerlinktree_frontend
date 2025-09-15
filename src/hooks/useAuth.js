import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (err) {
      localStorage.removeItem("token");
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(checkToken);

  useEffect(() => {
    setIsAuthenticated(checkToken());
  }, []);

  return { isAuthenticated };
}
