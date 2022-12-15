import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";
import { ReactComponent as userIcon } from "../../../assets/user-svgrepo-com.svg";
import { ReactComponent as logoutIcon } from "../../../assets/logout-svgrepo-com.svg";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

interface StylesProps {
  isShow: boolean;
}

const SidebarWrapper = styled.div<StylesProps>`
  background-color: ${(props) =>
    props.isShow ? "#658DA6" : "rgba(25,118,210,0.2)"};
  width: ${(props) => (props.isShow ? "260px" : "15px")};
  flex-shrink: 0;
  height: calc(100vh - 70px);
  transition: width 0.3s;
  position: fixed;
  z-index: 10;
  filter: brightness(115%);

  @media (max-width: 808px) {
    background-color: ${() => "#658DA6"};
    width: ${(props) => (props.isShow ? "260px" : "0px")};
    overflow: hidden;
  }
`;

const LinkList = styled.div<StylesProps>`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
`;

const LinkWrapper = styled.div<{ $selected?: boolean }>`
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 20px;
  cursor: pointer;
  background-color: #658da6;
  filter: ${(props) => (props.$selected ? "brightness(90%)" : "")};

  &:hover {
    filter: brightness(90%);
  }
`;

const LinkText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #f2f2f2;
  font-size: 20px;
  font-weight: 600;
  border-bottom: solid 2px transparent;
  transition: border-bottom-color 0.3s ease-out;
`;

const ProjectIcon = styled(projectIcon)`
  width: 24px;
  margin-right: 10px;
  path {
    fill: #f2f2f2;
  }

  rect {
    fill: #f2f2f2;
  }
`;

const UserIcon = styled(userIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #f2f2f2;
  }

  circle {
    fill: #f2f2f2;
  }
`;

const LogoutIcon = styled(logoutIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #f2f2f2;
  }

  rect {
    fill: #f2f2f2;
  }
`;

const MobileBackDrop = styled.div<StylesProps>`
  display: none;

  @media (max-width: 808px) {
    display: block;
    position: absolute;
    z-index: 5;
    opacity: ${(props) => (props.isShow ? "0.5" : "0")};
    width: 100vw;
    transition: opacity 0.3s ease-in;
    min-height: calc(100vh - 70px);
    background-color: #000;
    pointer-events: ${(props) => (props.isShow ? "auto" : "none")};
  }
`;

interface Props {
  isShow: boolean;
  contentType: string;
  setContentType: (value: string) => void;
  onClose: () => void;
}

const DashboardSidebar: React.FC<Props> = ({
  isShow,
  contentType,
  setContentType,
  onClose,
}) => {
  const { logout } = useAuth();

  const logoutHandler = () => {
    Swal.fire({
      title: "Confirm to logout",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#658da6b4",
      confirmButtonText: "Logout",
      confirmButtonColor: "#e74d3ce3",
    }).then((result) => {
      if (result.value === true) {
        logout();
      }
    });
  };

  return (
    <>
      <SidebarWrapper isShow={isShow}>
        <LinkList isShow={isShow}>
          <LinkWrapper
            $selected={contentType === "workspace"}
            onClick={() => {
              setContentType("workspace");
            }}
          >
            <ProjectIcon />
            <LinkText>Workspace</LinkText>
          </LinkWrapper>
          <LinkWrapper
            $selected={contentType === "profile"}
            onClick={() => {
              setContentType("profile");
            }}
          >
            <UserIcon />
            <LinkText>Profile</LinkText>
          </LinkWrapper>
          <LinkWrapper onClick={logoutHandler}>
            <LogoutIcon />
            <LinkText>Logout</LinkText>
          </LinkWrapper>
        </LinkList>
      </SidebarWrapper>
      <MobileBackDrop isShow={isShow} onClick={onClose} />
    </>
  );
};

export default DashboardSidebar;
