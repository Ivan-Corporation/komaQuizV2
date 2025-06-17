import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function PrivateRoute() {
  const token = useAuthStore((state) => state.token);
  const isLoaded = useAuthStore((state) => state.isLoaded);

  if (!isLoaded) return null;
  return token ? <Outlet /> : <Navigate to="/login" />;
}
