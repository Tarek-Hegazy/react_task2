import { useAuthStore } from "@/store/auth";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGurdRoute = () => {
  const { pathname } = useLocation();
  const { token, isValidTokens } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const valid = await isValidTokens();
      setIsAuth(valid);
      setIsLoading(false);
    };
    checkAuth();
  }, [isValidTokens, token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to={`/login?redirectTo=${pathname}`} />;
  }

  return <Outlet />;
};

export default AuthGurdRoute;
