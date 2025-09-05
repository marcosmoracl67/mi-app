import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Cargando acceso...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
