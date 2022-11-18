import styled from "styled-components";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import GanttChart from "./components/GanttChart";
import ChartSidebar from "./components/ChartSidebar";
import ProgressChart from "./components/ProgressChart/ProgressChart";
import produce from "immer";

const Container = styled.div`
  display: flex;
`;

const ChartArea = styled.div<{ isShowSidebar: boolean }>`
  overflow: scroll;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: padding 0.3s;
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) => (props.isShowSidebar ? "calc(100vw - 260px)" : "100%")};
  height: 40px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #fff;
  z-index: 9;
  transition: width 0.3s;
`;

const ProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const ShowSidebarButton = styled.button<{ isShowSidebar: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: #1976d2;
  top: 60px;
  left: ${(props) => (props.isShowSidebar ? "245px" : "0px")};
  height: 30px;
  width: 30px;
  background-color: aliceblue;
  border-color: #1976d2;
  border-radius: 50%;
  cursor: pointer;
  z-index: 12;
  transition: left 0.3s;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface ProjectInterface {
  id: string;
  title: string;
  lists: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  draggingLists?: string[];
  draggingCards?: string[];
}

interface Workspace {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
}

const Chart = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [project, setProject] = useState<ProjectInterface | undefined>(
    undefined
  );
  const [members, setMembers] = useState<Member[]>([]);
  // const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const { id, chartType } = useParams();

  useEffect(() => {
    if (!id) return;
    const projectRef = doc(db, "projects", id);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        const newProject = snapshot.data() as ProjectInterface;
        setProject(newProject);
      } else setIsExist(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getMembersHandler = async () => {
      if (!project) return;
      const workspaceRef = collection(db, "workspaces");
      const q = query(
        workspaceRef,
        where("projects", "array-contains-any", [
          { id: id, title: project?.title },
        ])
      );
      const querySnapshot = await getDocs(q);
      const emptyWorkspaceArr: Workspace[] = [];
      const curWorkspaces = produce(emptyWorkspaceArr, (draftState) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as Workspace;
          draftState.push(docData);
        });
      });
      const usersRef = collection(db, "users");
      const userQ = query(
        usersRef,
        where("uid", "in", curWorkspaces[0].members)
      );
      const userQuerySnapshot = await getDocs(userQ);
      const emptyMemberArr: Member[] = [];
      const curMembers = produce(emptyMemberArr, (draftState) => {
        userQuerySnapshot.forEach((doc) => {
          const docData = doc.data() as Member;
          draftState.push(docData);
        });
      });
      // setMemberIDs(curWorkspaces[0].members);
      setMembers(curMembers);
    };

    getMembersHandler();
  }, [project]);

  const chartHandler = () => {
    if (!project) return;
    if (chartType === "gantt") {
      return <GanttChart lists={project.lists} />;
    }
    if (chartType === "progress") {
      return (
        <ProgressChart
          lists={project.lists}
          tags={project.tags || []}
          members={members}
        />
      );
    }
  };

  return (
    <Container>
      <ChartSidebar isShow={isShowSidebar} />
      <ShowSidebarButton
        isShowSidebar={isShowSidebar}
        onClick={() => {
          setIsShowSidebar((prev) => !prev);
        }}
      >
        {isShowSidebar ? "<" : ">"}
      </ShowSidebarButton>
      <ChartArea isShowSidebar={isShowSidebar}>
        <SubNavbar isShowSidebar={isShowSidebar}>
          <ProjectTitle>
            {isExist ? project?.title : "Project is not exist"}
          </ProjectTitle>
        </SubNavbar>
        {isExist && chartHandler()}
      </ChartArea>
    </Container>
  );
};

export default Chart;
