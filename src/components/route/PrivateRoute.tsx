import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

export const LoginRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/dashboard" /> : children;
};
