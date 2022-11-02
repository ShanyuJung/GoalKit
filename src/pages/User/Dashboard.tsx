import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import produce from "immer";

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

const Dashboard = () => {
  const [workspaces, setWorkspace] = useState<
    {
      id: string;
      owner: string;
      title: string;
      projects: { id: string; title: string }[];
    }[]
  >([]);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  useEffect(() => {
    const getWorkspaceHandler = async () => {
      const userID = currentUser.uid;
      const workspaceRef = collection(db, "workspaces");
      const q = query(workspaceRef, where("owner", "==", userID));

      const querySnapshot = await getDocs(q);
      const newWorkspaces = produce(workspaces, (draftState) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as {
            id: string;
            owner: string;
            title: string;
            projects: { id: string; title: string }[];
          };
          draftState.push(docData);
        });
      });

      setWorkspace(newWorkspaces);
    };

    getWorkspaceHandler();
  }, []);

  return (
    <PrivateRoute>
      <Wrapper>
        <Sidebar>
          Sidebar
          <button onClick={logout}>logout</button>
        </Sidebar>
        <WorkspaceWrapper>
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
        </WorkspaceWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Dashboard;
