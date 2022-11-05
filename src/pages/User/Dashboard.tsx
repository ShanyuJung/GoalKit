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

const Wrapper = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  background-color: red;
  height: calc(100vh - 50px);
`;

const WorkspaceWrapper = styled.div`
  background-color: aliceblue;
  flex-grow: 1;
  height: calc(100vh - 50px);
`;

const Workspace = styled.div`
  width: 100px;
  height: 100px;
  background-color: aqua;
  margin: 10px;
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

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
      if (isLoading) return;
      try {
        setIsLoading(true);
        await getWorkspaceHandler();
        await getGuestWorkspaceHandler();
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    };

    getDataHandler();
  }, []);

  return (
    <PrivateRoute>
      <Wrapper>
        <Sidebar>
          Sidebar
          <button onClick={logout}>logout</button>
        </Sidebar>
        <WorkspaceWrapper>
          <div>My workspace</div>
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
          <div>Guest workspace</div>
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
          <NewWorkspace onSubmit={newWorkspaceHandler} />
        </WorkspaceWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Dashboard;
