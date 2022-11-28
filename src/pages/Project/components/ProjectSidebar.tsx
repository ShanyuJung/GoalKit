import { collection, getDocs, query, where } from "firebase/firestore";
import produce from "immer";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../../firebase";
import { ReactComponent as ganttIcon } from "../../../assets/chart-gantt-svgrepo-com.svg";
import { ReactComponent as pieChartIcon } from "../../../assets/pie-chart-svgrepo-com.svg";

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
  cursor: pointer;

  &:hover {
    background-color: #156cc2;
  }
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
`;

const GanttIcon = styled(ganttIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

const PieChartIcon = styled(pieChartIcon)`
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
  isShow: boolean;
}

const ProjectSidebar: React.FC<Props> = ({ title, isShow }) => {
  const [workspaceId, setWorkspaceId] = useState("");
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
          Back to Workspace
        </WorkspaceTitle>
      </WorkspaceTitleWrapper>
      <LinkList isShow={isShow}>
        <LinkWrapper>
          <StyledLink to={`/project/${id}/chart/gantt`} relative="path">
            <GanttIcon />
            <LinkText>Gantt Chart</LinkText>
          </StyledLink>
        </LinkWrapper>
        <LinkWrapper>
          <StyledLink to={`/project/${id}/chart/progress`} relative="path">
            <PieChartIcon />
            <LinkText>Progress Chart</LinkText>
          </StyledLink>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default ProjectSidebar;
