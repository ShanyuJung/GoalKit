import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

const LoginRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/dashboard" /> : children;
};

export default LoginRoute;
