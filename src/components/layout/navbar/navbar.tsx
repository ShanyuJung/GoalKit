import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 50px;
  border-bottom: 1px black solid;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1565c0;
  z-index: 20;
`;

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      Navbar
      <button
        onClick={() => {
          navigate("/signup");
        }}
      >
        signup
      </button>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        login
      </button>
      <button
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        dashboard
      </button>
    </Wrapper>
  );
};

export default Navbar;
