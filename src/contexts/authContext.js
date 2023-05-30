"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { createContext } from "react";
import { apiClient } from "@/services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (isAuth === false) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  async function verifyToken() {
    const { token } = parseCookies();
    if (token) {
      const { isValid } = await apiClient.post("/auth/verify", {
        token,
      });
      return setIsAuth(isValid);
    }
    return setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{ isAuth }}>{children}</AuthContext.Provider>
  );
}
