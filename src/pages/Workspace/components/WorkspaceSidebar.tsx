import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";
import { ReactComponent as memberIcon } from "../../../assets/user-svgrepo-com.svg";
import { ReactComponent as chatIcon } from "../../../assets/chat-svgrepo-com.svg";

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

const WorkspaceTitleWrapper = styled.div<StylesProps>`
  height: 55px;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;
  border-bottom: ${(props) => (props.isShow ? "1px #ddd solid" : "none")};
`;

const WorkspaceTitle = styled.div<StylesProps>`
  font-size: 22px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  font-weight: bold;
  display: ${(props) => (props.isShow ? "block" : "none")};
  cursor: pointer;
  border-bottom: solid 2px transparent;
  transition: border-bottom-color 0.3s ease-out;

  &:hover {
    font-weight: 900;
    border-bottom: solid 2px #fff;
  }
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

const MemberIcon = styled(memberIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  circle {
    fill: #fff;
  }
`;

const ChatIcon = styled(chatIcon)`
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
  setIsShowChatRoom: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const WorkspaceSidebar: React.FC<Props> = ({
  isShow,
  setContentType,
  setIsShowChatRoom,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <SidebarWrapper isShow={isShow}>
      <WorkspaceTitleWrapper isShow={isShow}>
        <WorkspaceTitle
          isShow={isShow}
          onClick={() => {
            navigate(`/dashboard`);
          }}
        >
          Back to DashBoard
        </WorkspaceTitle>
      </WorkspaceTitleWrapper>
      <LinkList isShow={isShow}>
        <LinkWrapper
          onClick={() => {
            setContentType("project");
          }}
        >
          <ProjectIcon />
          <LinkText>Project Boards</LinkText>
        </LinkWrapper>
        <LinkWrapper
          onClick={() => {
            setContentType("member");
          }}
        >
          <MemberIcon />
          <LinkText>Members</LinkText>
        </LinkWrapper>
        <LinkWrapper
          onClick={() => {
            setIsShowChatRoom((prev) => !prev);
          }}
        >
          <ChatIcon />
          <LinkText>Chart Room</LinkText>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default WorkspaceSidebar;
