import { useEffect, useState, useRef, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import {
  getDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import NewProject from "./components/NewProject";
import produce from "immer";
import { async } from "@firebase/util";

const Wrapper = styled.div`
  display: flex;
`;

const SidebarWrapper = styled.div`
  background-color: #ccc;
  height: calc(100vh - 50px);
`;

const MemberWrapper = styled.div`
  margin: 10px;
`;

const MemberForm = styled.form``;

const MemberInput = styled.input``;

const MemberButton = styled.button``;

const ChatRoomButton = styled.button`
  margin: 10px;
`;

const ProjectsWrapper = styled.div`
  margin: 10px;
`;

const ProjectCard = styled.div`
  border: 1px #000 solid;
  width: 100px;
  height: 100px;
  margin: 5px;
`;

interface UserInterface {
  uid: string;
  email: string;
  displayName: string;
}

const Workspace = () => {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const memberRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const getProjectHandler = async () => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const workspaceRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        setIsExist(true);
        setProjects(docSnap.data().projects);
      } else {
        setIsExist(false);
      }
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const newProjectHandler = async (projectTitle: string) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const setRef = doc(collection(db, "projects"));
      const newProject = {
        id: setRef.id,
        lists: [],
        title: projectTitle,
      };
      await setDoc(setRef, newProject);
      const docRef = doc(db, "workspaces", id);
      const newObj = {
        id: setRef.id,
        title: projectTitle,
      };
      await updateDoc(docRef, { projects: arrayUnion(newObj) });
      await getProjectHandler();
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const searchUserHandler = async (email: string) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const usersFormat: UserInterface[] = [];
    const userList = produce(usersFormat, (draftState) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data() as UserInterface;
        draftState.push(user);
      });
    });
    return userList;
  };

  const updateMemberHandler = async (userID: string) => {
    if (id) {
      const workspaceRef = doc(db, "workspaces", id);
      await updateDoc(workspaceRef, { members: arrayUnion(userID) });
    }
  };

  const addMemberHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (!memberRef.current?.value.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const emailString = memberRef.current?.value.trim();
      const userList = await searchUserHandler(emailString);
      if (!userList || userList.length === 0) {
        alert("User not found");
        return;
      }
      const searchedUser = [...userList][0];
      await updateMemberHandler(searchedUser.uid);
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProjectHandler();
  }, []);

  const projectList = () => {
    return (
      <>
        {isExist && (
          <>
            {projects.map((project) => {
              return (
                <ProjectCard
                  key={project.id}
                  onClick={() => {
                    navigate(`/project/${project.id}`);
                  }}
                >
                  {project.title}
                </ProjectCard>
              );
            })}
            <NewProject onSubmit={newProjectHandler} />
          </>
        )}
        {isExist === false && <div>workspace not exist.</div>}
      </>
    );
  };

  return (
    <PrivateRoute>
      <Wrapper>
        <SidebarWrapper>
          <MemberWrapper>
            <MemberForm onSubmit={addMemberHandler}>
              <MemberInput
                placeholder="Enter email to add member"
                type="text"
                required
                ref={memberRef}
              />
              <MemberButton>Add member</MemberButton>
            </MemberForm>
          </MemberWrapper>
          <ChatRoomButton>chat room</ChatRoomButton>
        </SidebarWrapper>
        <ProjectsWrapper>{projectList()}</ProjectsWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
