import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import produce from "immer";
import NewWorkspace from "./components/NewWorkspace";
import DashboardSidebar from "./components/DashboardSidebar";
import Profile from "./components/Profile";
import Swal from "sweetalert2";

const Wrapper = styled.div`
  display: flex;
`;

const WorkspaceWrapper = styled.div<{ isShowSidebar: boolean }>`
  background-color: aliceblue;
  flex-grow: 1;
  height: calc(100vh - 50px);
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: padding 0.3s;
`;

const Workspace = styled.div`
  position: relative;
  z-index: 1;
  width: 240px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.35);
  cursor: pointer;

  &::before {
    content: "";
    background-color: #ddd;
    position: absolute;
    z-index: -1;
    width: 240px;
    height: 100px;
    border-radius: 5px;
  }

  &:hover {
    &::before {
      background-color: #ccc;
    }
  }
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

const WorkspaceBanner = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #000;
  border-bottom: 1px solid #ccc;
`;

const WorkspaceSubBanner = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: #000;
`;

const WorkspaceListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  max-width: 1160px;
  margin: 0px auto;
  padding: 35px 50px;
`;

interface Workspace {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

const Dashboard = () => {
  const [workspaces, setWorkspace] = useState<Workspace[] | never>([]);
  const [guestWorkspaces, setGuestWorkspace] = useState<Workspace[] | never>(
    []
  );
  const [contentType, setContentType] = useState("workspace");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const getWorkspaceHandler = async () => {
    const userID = currentUser.uid;
    const workspaceRef = collection(db, "workspaces");
    const q = query(workspaceRef, where("owner", "==", userID));
    const querySnapshot = await getDocs(q);
    const emptyArr: Workspace[] = [];
    const newWorkspaces = produce(emptyArr, (draftState) => {
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as Workspace;
        draftState.push(docData);
      });
    });
    setWorkspace(newWorkspaces);
  };

  const newWorkspaceHandler = async (newWorkspaceTitle: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const setRef = doc(collection(db, "workspaces"));
      const userUid = currentUser.uid;
      const newWorkspace = {
        id: setRef.id,
        title: newWorkspaceTitle,
        projects: [],
        owner: userUid,
        members: [userUid],
      };
      await setDoc(setRef, newWorkspace);
      const roomRef = doc(db, "chatRooms", setRef.id);
      await setDoc(roomRef, { message: "create room succeed." });
      await getWorkspaceHandler();
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const getGuestWorkspaceHandler = async () => {
    const userID = currentUser.uid;
    const workspaceRef = collection(db, "workspaces");
    const q = query(
      workspaceRef,
      where("members", "array-contains-any", [userID])
    );
    const querySnapshot = await getDocs(q);
    const emptyArr: Workspace[] = [];
    const newWorkspaces = produce(emptyArr, (draftState) => {
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as Workspace;
        if (docData.owner !== userID) {
          draftState.push(docData);
        }
      });
    });
    setGuestWorkspace(newWorkspaces);
  };

  useEffect(() => {
    const getDataHandler = async () => {
      if (isLoading || !currentUser) return;
      try {
        setIsLoading(true);
        await getWorkspaceHandler();
        await getGuestWorkspaceHandler();
      } catch (e) {
        Swal.fire("Something went wrong!", `${e}`, "warning");
      }
      setIsLoading(false);
    };

    getDataHandler();
  }, []);

  const workspaceList = () => {
    return (
      <>
        <WorkspaceSubBanner>My workspace</WorkspaceSubBanner>
        <WorkspaceListWrapper>
          <NewWorkspace onSubmit={newWorkspaceHandler} />
          {workspaces.length > 0 &&
            workspaces.map((workspace) => {
              return (
                <Workspace
                  key={workspace.id}
                  onClick={() => {
                    navigate(`/workspace/${workspace.id}`);
                  }}
                >
                  {workspace.title}
                </Workspace>
              );
            })}
        </WorkspaceListWrapper>
        <WorkspaceSubBanner>Guest workspace</WorkspaceSubBanner>
        <WorkspaceListWrapper>
          {guestWorkspaces.length > 0 &&
            guestWorkspaces.map((workspace) => {
              return (
                <Workspace
                  key={workspace.id}
                  onClick={() => {
                    navigate(`/workspace/${workspace.id}`);
                  }}
                >
                  {workspace.title}
                </Workspace>
              );
            })}
        </WorkspaceListWrapper>
      </>
    );
  };

  return (
    <PrivateRoute>
      <Wrapper>
        <DashboardSidebar
          isShow={isShowSidebar}
          contentType={contentType}
          setContentType={setContentType}
        />
        <ShowSidebarButton
          isShowSidebar={isShowSidebar}
          onClick={() => {
            setIsShowSidebar((prev) => !prev);
          }}
        >
          {isShowSidebar ? "<" : ">"}
        </ShowSidebarButton>
        <WorkspaceWrapper isShowSidebar={isShowSidebar}>
          <WorkspaceBanner>{`Welcome back, ${currentUser.displayName}!`}</WorkspaceBanner>

          {contentType === "workspace" ? workspaceList() : <></>}
          {contentType === "profile" ? <Profile /> : <></>}
        </WorkspaceWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Dashboard;
