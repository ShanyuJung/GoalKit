import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as homeIcon } from "../../../assets/logo-svgrepo-com.svg";
import { ReactComponent as userIcon } from "../../../assets/user-svgrepo-com.svg";
import { useAuth } from "../../../contexts/AuthContext";

const Wrapper = styled.div`
  width: 100vw;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2c4859;
  z-index: 20;
  display: flex;
  padding: 0px 30px;
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
    background-color: #658da6;
  }
`;

const HomeIcon = styled(homeIcon)`
  width: 28px;
  height: 28px;
  margin-right: 5px;

  path {
    fill: #f2f2f2;
  }
`;

const HomeIconText = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: #f2f2f2;
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

  outline: 2px solid #f2f2f2;

  &:hover {
    outline: 2px solid #f2dac4;
  }
`;

const UserIcon = styled(userIcon)`
  width: 35px;
  height: 35px;
  cursor: pointer;

  path {
    fill: #f2f2f2;
  }

  circle {
    fill: #f2f2f2;
  }
`;

const LoginUserIcon = styled.div<{ $background?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background-color: #f2f2f2;
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;
  cursor: pointer;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const displayUserIcon = () => {
    if (currentUser && currentUser.photoURL) {
      return (
        <LoginUserIcon
          $background={currentUser.photoURL}
          onClick={() => {
            navigate("/dashboard");
          }}
        ></LoginUserIcon>
      );
    }

    return (
      <LoginUserIcon
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        {currentUser.displayName.charAt()}
      </LoginUserIcon>
    );
  };

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
          displayUserIcon()
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
