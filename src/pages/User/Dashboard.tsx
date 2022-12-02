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
import ReactLoading from "react-loading";

const Wrapper = styled.div`
  display: flex;
`;

const WorkspaceWrapper = styled.div<{ isShowSidebar: boolean }>`
  background-color: aliceblue;
  flex-grow: 1;
  height: calc(100vh - 70px);
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: padding 0.3s;
  overflow-y: scroll;

  @media (max-width: 550px) {
    padding-left: 15px;
  }
`;

const Workspace = styled.div`
  position: relative;
  z-index: 1;
  width: 215px;
  max-width: 215px;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #658da6;

  flex-shrink: 0;

  &::before {
    position: absolute;
    content: "";
    width: 60px;
    height: 10px;
    border-radius: 5px;
    background-color: #fafafa;
    top: 20px;
    left: 20px;
    opacity: 0.5;
    transition: width 0.3s;
  }

  &:hover {
    filter: brightness(110%);

    &::before {
      width: 60%;
      opacity: 1;
    }
  }

  @media (max-width: 809px) {
    flex-grow: 1;
  }
`;

const Text = styled.div`
  width: 100%;
  text-align: right;
  color: #2c4859;
  color: #fafafa;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
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

const WorkspaceBanner = styled.div`
  width: 96%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #1d3240;
  border-bottom: 1px solid #658da6;
  margin: 0px 2%;
  padding: 0px 20px;
`;

const WorkspaceSubBanner = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: #1d3240;
`;

const WorkspaceListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  max-width: 1020px;
  margin: 0px auto;
  padding: 35px 50px;

  @media (max-width: 1279px) {
    max-width: 785px;
  }

  @media (max-width: 1044px) {
    max-width: 550px;
  }

  @media (max-width: 809px) {
    justify-content: center;
  }
`;

const Loading = styled(ReactLoading)`
  margin: auto;
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
        Swal.fire(
          "Failed to connect server!",
          "Please check your internet is connected and try again later",
          "warning"
        );
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
          {isLoading ? (
            <Loading type="spinningBubbles" color="#313538" />
          ) : (
            <>
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
                      <Text>{workspace.title}</Text>
                    </Workspace>
                  );
                })}
            </>
          )}
        </WorkspaceListWrapper>
        <WorkspaceSubBanner>Guest workspace</WorkspaceSubBanner>
        <WorkspaceListWrapper>
          {isLoading ? (
            <Loading type="spinningBubbles" color="#313538" />
          ) : (
            guestWorkspaces.length > 0 &&
            guestWorkspaces.map((workspace) => {
              return (
                <Workspace
                  key={workspace.id}
                  onClick={() => {
                    navigate(`/workspace/${workspace.id}`);
                  }}
                >
                  <Text>{workspace.title}</Text>
                </Workspace>
              );
            })
          )}
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
          {currentUser && (
            <WorkspaceBanner>{`Welcome back, ${currentUser.displayName}!`}</WorkspaceBanner>
          )}

          {contentType === "workspace" ? workspaceList() : <></>}
          {contentType === "profile" ? <Profile /> : <></>}
        </WorkspaceWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Dashboard;
