import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";
import { ReactComponent as userIcon } from "../../../assets/user-svgrepo-com.svg";
import { ReactComponent as logoutIcon } from "../../../assets/logout-svgrepo-com.svg";
import { useAuth } from "../../../contexts/AuthContext";

interface StylesProps {
  isShow: boolean;
}

const SidebarWrapper = styled.div<StylesProps>`
  background-color: ${(props) =>
    props.isShow ? "#1976d2" : "rgba(25,118,210,0.2)"};
  width: ${(props) => (props.isShow ? "260px" : "15px")};
  flex-shrink: 0;
  height: calc(100vh - 50px);
  transition: width 0.3s;
  position: fixed;
  z-index: 10;
`;

const LinkList = styled.div<StylesProps>`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
`;

const LinkWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  height: 50px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
`;

const LinkText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  border-bottom: solid 2px transparent;
  transition: border-bottom-color 0.3s ease-out;
  cursor: pointer;

  &:hover {
    font-weight: 900;
    border-bottom: solid 2px #fff;
  }
`;

const ProjectIcon = styled(projectIcon)`
  width: 24px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

const UserIcon = styled(userIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  circle {
    fill: #fff;
  }
`;

const LogoutIcon = styled(logoutIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

interface Props {
  isShow: boolean;
  setContentType: (value: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ isShow, setContentType }) => {
  const { logout } = useAuth();

  return (
    <SidebarWrapper isShow={isShow}>
      <LinkList isShow={isShow}>
        <LinkWrapper
          onClick={() => {
            setContentType("workspace");
          }}
        >
          <ProjectIcon />
          <LinkText>Workspace</LinkText>
        </LinkWrapper>
        <LinkWrapper
          onClick={() => {
            setContentType("profile");
          }}
        >
          <UserIcon />
          <LinkText>Profile</LinkText>
        </LinkWrapper>
        <LinkWrapper>
          <LogoutIcon />
          <LinkText onClick={logout}>Logout</LinkText>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default DashboardSidebar;
