import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthRoute } from "./common/routePaths";

export default function AuthRoute() {
  const location = useLocation();
  const { data: authdata, isLoading } = useAuth();

  const user = authdata?.user;

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading && !_isAuthRoute) return <p>Loading...</p>;

  // if (!user) return <Navigate to="auth/sign-in" replace />;
  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />;
}
