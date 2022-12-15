import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";
import { ReactComponent as memberIcon } from "../../../assets/user-svgrepo-com.svg";
import { ReactComponent as chatIcon } from "../../../assets/chat-svgrepo-com.svg";

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

const WorkspaceTitleWrapper = styled.div<StylesProps>`
  height: 55px;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;
  border-bottom: ${(props) => (props.isShow ? "2px #f2f2f2 solid" : "none")};
  display: ${(props) => (props.isShow ? "flex" : "none")};
  background-color: #658da6;

  &:hover {
    filter: brightness(90%);
  }
`;

const WorkspaceTitle = styled.div<StylesProps>`
  font-size: 22px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #f2f2f2;
  font-weight: bold;
  display: ${(props) => (props.isShow ? "block" : "none")};
  cursor: pointer;
  transition: border-bottom-color 0.3s ease-out;
  font-weight: 900;
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

const MemberIcon = styled(memberIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #f2f2f2;
  }

  circle {
    fill: #f2f2f2;
  }
`;

const ChatIcon = styled(chatIcon)`
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
  setIsShowChatRoom: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onClose: () => void;
}

const WorkspaceSidebar: React.FC<Props> = ({
  isShow,
  contentType,
  setContentType,
  setIsShowChatRoom,
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <SidebarWrapper isShow={isShow}>
        <WorkspaceTitleWrapper isShow={isShow}>
          <WorkspaceTitle
            isShow={isShow}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Back to DashBoard
          </WorkspaceTitle>
        </WorkspaceTitleWrapper>
        <LinkList isShow={isShow}>
          <LinkWrapper
            $selected={contentType === "project"}
            onClick={() => {
              setContentType("project");
            }}
          >
            <ProjectIcon />
            <LinkText>Project Boards</LinkText>
          </LinkWrapper>
          <LinkWrapper
            $selected={contentType === "member"}
            onClick={() => {
              setContentType("member");
            }}
          >
            <MemberIcon />
            <LinkText>Members</LinkText>
          </LinkWrapper>
          <LinkWrapper
            onClick={() => {
              setIsShowChatRoom((prevIsShowChatRoom) => !prevIsShowChatRoom);
            }}
          >
            <ChatIcon />
            <LinkText>Chat Room</LinkText>
          </LinkWrapper>
        </LinkList>
      </SidebarWrapper>
      <MobileBackDrop isShow={isShow} onClick={onClose} />
    </>
  );
};

export default WorkspaceSidebar;
