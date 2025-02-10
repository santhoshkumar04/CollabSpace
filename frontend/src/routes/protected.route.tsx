import useAuth from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { data: authdata, isLoading } = useAuth();
  const user = authdata?.user;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
