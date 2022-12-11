import styled from "styled-components";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
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
import PrivateRoute from "../../components/route/PrivateRoute";
import {
  MemberInterface,
  WorkspaceInterface,
  ProjectInterface,
} from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

const Container = styled.div`
  display: flex;
`;

const ChartArea = styled.div<{ isShowSidebar: boolean }>`
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: padding 0.3s;
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) =>
    props.isShowSidebar ? "calc(100vw - 260px)" : "calc(100% - 15px)"};
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
  color: #658da6;
  top: 80px;
  left: ${(props) => (props.isShowSidebar ? "245px" : "0px")};
  height: 30px;
  width: 30px;
  background-color: #f2f2f2;
  border-color: #658da6;
  border-radius: 50%;
  cursor: pointer;
  z-index: 12;
  transition: left 0.3s;
`;

const ErrorText = styled.div`
  margin-top: 40px;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
`;

export const getWorkspaceHandler = async ({ params }: LoaderFunctionArgs) => {
  if (!params.workspaceID) return null;
  try {
    const workspaceRef = doc(db, "workspaces", params.workspaceID);
    const docSnap = await getDoc(workspaceRef);
    if (docSnap.exists()) {
      const response = docSnap.data() as WorkspaceInterface;
      const membersResponse = response.members;
      return membersResponse;
    }
    Swal.fire("Error", "Workspace is not exist!", "warning");
    return null;
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Missing or insufficient permissions.") {
        Swal.fire(
          "Authentication Error!",
          "Please login before start your work.",
          "warning"
        );
        return;
      }
    }
    Swal.fire(
      "Failed to connect server!",
      "Please check your internet connection and try again later.",
      "warning"
    );
  }
};

const Chart = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [isPermission, setIsPermission] = useState(false);
  const [project, setProject] = useState<ProjectInterface | undefined>(
    undefined
  );
  const [members, setMembers] = useState<MemberInterface[]>([]);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const { workspaceID, projectID, chartType } = useParams();
  const response = useLoaderData() as string[] | null;
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!projectID || !workspaceID || !currentUser) return;

    if (!response) {
      setIsExist(false);
      setIsPermission(false);
      return;
    }

    if (currentUser && !response.includes(currentUser?.uid)) {
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
        <ChartSidebar isShow={isShowSidebar} />
        <ShowSidebarButton
          isShowSidebar={isShowSidebar}
          onClick={() => {
            setIsShowSidebar((prevIsShowSidebar) => !prevIsShowSidebar);
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
