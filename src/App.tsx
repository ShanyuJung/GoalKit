import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/navbar/navbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
