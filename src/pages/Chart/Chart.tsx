import styled from "styled-components";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import GanttChart from "./components/GanttChart";
import ChartSidebar from "./components/ChartSidebar";
import ProgressChart from "./components/ProgressChart/ProgressChart";
import produce from "immer";
import { PrivateRoute } from "../../components/route/PrivateRoute";
import {
  MemberInterface,
  WorkspaceInterface,
  ProjectInterface,
} from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import SidebarButton from "../../components/layout/sidebar/SidebarButton";

const Container = styled.div`
  display: flex;
`;

const ChartArea = styled.div<{ isShowSidebar: boolean }>`
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "30px")};
  transition: padding 0.3s;

  @media (max-width: 808px) {
    padding-left: 0px;
  }
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) =>
    props.isShowSidebar ? "calc(100vw - 260px)" : "calc(100% - 30px)"};
  height: 40px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #fff;
  z-index: 9;
  transition: width 0.3s;

  @media (max-width: 808px) {
    width: 100%;
  }
`;

const ProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  min-width: 360px;
`;

const ErrorText = styled.div`
  margin-top: 40px;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
`;

const Chart = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [isPermission, setIsPermission] = useState(false);
  const [project, setProject] =
    useState<ProjectInterface | undefined>(undefined);
  const [members, setMembers] = useState<MemberInterface[]>([]);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const { workspaceID, projectID, chartType } = useParams();
  const response = useLoaderData() as WorkspaceInterface | null;
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!projectID || !workspaceID || !currentUser) return;

    if (!response) {
      setIsExist(false);
      setIsPermission(false);
      return;
    }

    if (currentUser && !response.members.includes(currentUser?.uid)) {
      setIsExist(true);
      setIsPermission(false);
      return;
    }

    const projectRef = doc(db, "projects", projectID);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsExist(true);
        setIsPermission(true);
        const newProject = snapshot.data() as ProjectInterface;
        setProject(newProject);
      } else {
        setIsExist(false);
        setIsPermission(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [response]);

  useEffect(() => {
    const getMembersHandler = async () => {
      if (!project || !workspaceID) return;
      const workspaceRef = doc(db, "workspaces", workspaceID);
      const workspaceDocSnap = await getDoc(workspaceRef);
      if (workspaceDocSnap.exists()) {
        const workspaceResponse = workspaceDocSnap.data() as WorkspaceInterface;
        const usersRef = collection(db, "users");
        const userQ = query(
          usersRef,
          where("uid", "in", workspaceResponse.members)
        );
        const userQuerySnapshot = await getDocs(userQ);
        const emptyMemberArr: MemberInterface[] = [];
        const curMembers = produce(emptyMemberArr, (draftState) => {
          userQuerySnapshot.forEach((doc) => {
            const docData = doc.data() as MemberInterface;
            draftState.push(docData);
          });
        });
        setMembers(curMembers);
      }
    };

    getMembersHandler();
  }, [project]);

  const renderDisplayChart = () => {
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
    <PrivateRoute>
      <Container>
        <ChartSidebar
          isShow={isShowSidebar}
          onClose={() => {
            setIsShowSidebar((prevIsShowSidebar) => !prevIsShowSidebar);
          }}
        />
        <SidebarButton
          isShowSidebar={isShowSidebar}
          setIsShowSidebar={setIsShowSidebar}
        />
        <ChartArea isShowSidebar={isShowSidebar}>
          <SubNavbar isShowSidebar={isShowSidebar}>
            <ProjectTitle>
              {isExist ? project?.title : "Project is not exist"}
            </ProjectTitle>
          </SubNavbar>
          {isExist && isPermission && renderDisplayChart()}
          {isExist === false && <ErrorText>Project is not exist.</ErrorText>}
          {isExist && !isPermission && (
            <ErrorText>
              You do not have permission to enter this workspace.
            </ErrorText>
          )}
        </ChartArea>
      </Container>
    </PrivateRoute>
  );
};

export default Chart;
