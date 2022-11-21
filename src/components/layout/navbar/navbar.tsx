import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as homeIcon } from "../../../assets/logo-svgrepo-com.svg";
import { ReactComponent as userIcon } from "../../../assets/user-svgrepo-com.svg";
import { useAuth } from "../../../contexts/AuthContext";

const Wrapper = styled.div`
  width: 100vw;
  height: 50px;
  border-bottom: 1px black solid;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1565c0;
  z-index: 20;
  display: flex;
  padding: 0px 20px;
  align-items: center;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const HomeIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 42px;
  padding: 0px 5px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgb(57, 118, 189);
  }
`;

const HomeIcon = styled(homeIcon)`
  width: 28px;
  height: 28px;
  path {
    fill: #fff;
  }
`;

const HomeIconText = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

const UserIconWrapper = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    outline: 1px #ccc solid;
  }
`;

const UserIcon = styled(userIcon)`
  width: 36px;
  height: 36px;
  cursor: pointer;

  path {
    fill: #fff;
  }

  circle {
    fill: #fff;
  }
`;

const LoginUserIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background-color: aliceblue;
  cursor: pointer;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Wrapper>
      <NavGroup>
        <HomeIconWrapper
          onClick={() => {
            navigate("/");
          }}
        >
          <HomeIcon />
          <HomeIconText>GoalKit</HomeIconText>
        </HomeIconWrapper>
      </NavGroup>
      <UserIconWrapper>
        {currentUser ? (
          <LoginUserIcon
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            {currentUser.displayName.charAt()}
          </LoginUserIcon>
        ) : (
          <UserIcon
            onClick={() => {
              navigate("/login");
            }}
          />
        )}
      </UserIconWrapper>
    </Wrapper>
  );
};

export default Navbar;
