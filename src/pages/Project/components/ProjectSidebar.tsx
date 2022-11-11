import { collection, getDocs, query, where } from "firebase/firestore";
import produce from "immer";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../../firebase";
import { ReactComponent as chartIcon } from "../../../assets/bar-chart-svgrepo-com.svg";

interface StylesProps {
  isShow: boolean;
}

const SidebarWrapper = styled.div<StylesProps>`
  background-color: ${(props) =>
    props.isShow ? "#1976d2" : "rgba(25,118,210,0.2)"};
  width: ${(props) => (props.isShow ? "260px" : "10px")};
  flex-shrink: 0;
  height: calc(100vh - 50px);
  transition: width 0.3s;
  position: fixed;
`;

const WorkspaceTitleWrapper = styled.div<StylesProps>`
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;
  border-bottom: ${(props) => (props.isShow ? "1px #ddd solid" : "none")};
`;

const WorkspaceTitle = styled.div<StylesProps>`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  display: ${(props) => (props.isShow ? "block" : "none")};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ToggleButton = styled.button<StylesProps>`
  border: none;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  padding: 0;
  background-color: ${(props) =>
    props.isShow ? "inherit" : "rgba(0,0,0,0.1)"};
  color: #fff;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 5px;
  position: ${(props) => (props.isShow ? "relative" : "absolute")};
  top: 10;
  left: 0;
  z-index: 10;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.isShow ? "#64b5f6" : "rgba(100,181,246,0.2)"};
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
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    font-size: 22px;
    font-weight: 900;
  }
`;

const ChartLogo = styled(chartIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

interface Workspace {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

interface Props {
  title: string | undefined;
}

const ProjectSidebar = ({ title }: Props) => {
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [isShow, setIsShow] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!title) return;
    const getWorkspaceHandler = async () => {
      const workspaceRef = collection(db, "workspaces");
      const q = query(
        workspaceRef,
        where("projects", "array-contains-any", [{ id: id, title: title }])
      );
      const querySnapshot = await getDocs(q);
      const emptyArr: Workspace[] = [];
      const [newWorkspaces] = produce(emptyArr, (draftState) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as Workspace;
          draftState.push(docData);
        });
      });

      setWorkspaceTitle(newWorkspaces.title);
      setWorkspaceId(newWorkspaces.id);
    };

    getWorkspaceHandler();
  }, [title, id]);

  return (
    <SidebarWrapper isShow={isShow}>
      <WorkspaceTitleWrapper isShow={isShow}>
        <WorkspaceTitle
          isShow={isShow}
          onClick={() => {
            navigate(`/workspace/${workspaceId}`);
          }}
        >
          {workspaceTitle}
        </WorkspaceTitle>
        <ToggleButton
          isShow={isShow}
          onClick={() => {
            setIsShow((prev) => !prev);
          }}
        >
          {isShow ? "<" : ">"}
        </ToggleButton>
      </WorkspaceTitleWrapper>
      <LinkList isShow={isShow}>
        <LinkWrapper>
          <StyledLink to={`/project/${id}/chart/gantt`} relative="path">
            <ChartLogo />
            Chart
          </StyledLink>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default ProjectSidebar;
