import { Navigate } from "react-router-dom";
import { useMainStore } from "../store/useMainStore";

export function PrivateRoute({ children }) {
  const token = useMainStore((state) => state.loginData?.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}