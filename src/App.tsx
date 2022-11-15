import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Navbar from "./components/layout/navbar/navbar";
import { AuthProvider } from "./contexts/AuthContext";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  #root {
    min-height: 100vh;
    padding: 50px 0px 0px 0px;
    position: relative;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <Navbar />
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
