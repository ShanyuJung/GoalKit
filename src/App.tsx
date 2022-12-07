import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Navbar from "./components/layout/navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  #root {
    min-height: calc(100vh - 70px);
    margin-top: 70px;
    padding: 0px ;
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
