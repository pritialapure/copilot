import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute() {
  // TODO: Render the outlet only with a stored token, otherwise redirect to /login.
  return <Outlet />;
}
