import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  border-bottom: 1px black solid;
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
