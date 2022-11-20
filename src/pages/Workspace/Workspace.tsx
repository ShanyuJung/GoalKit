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
  onSnapshot,
  serverTimestamp,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import NewProject from "./components/NewProject";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../contexts/AuthContext";
import WorkspaceSidebar from "./components/WorkspaceSidebar";

const Wrapper = styled.div`
  display: flex;
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

const ProjectsWrapper = styled.div<{ isShowSidebar: boolean }>`
  height: calc(100vh - 50px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0px 40px;
  padding-left: ${(props) => (props.isShowSidebar ? "300px" : "55px")};
  transition: padding 0.3s;
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

const ProjectCardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  padding: 35px 20px;
`;

const ProjectCard = styled.div`
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

const ProjectCardTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ErrorText = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 24px;
  padding-top: 20px;
`;

const ChatRoomWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 200px;
  height: 500px;
  border: 1px #000 solid;
`;

const MessageInputForm = styled.form``;

const MessageInput = styled.input``;

const MessageButton = styled.button``;

interface UserInterface {
  uid: string;
  email: string;
  displayName: string;
}

interface MessageInterface {
  userID: string;
  time: Timestamp;
  message: string;
  id: string;
}

const Workspace = () => {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isShowChatRoom, setIsShowChatRoom] = useState<boolean>(false);
  const memberRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  const getProjectHandler = async () => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const workspaceRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        setIsExist(true);
        setProjects(docSnap.data().projects);
        setTitle(docSnap.data().title);
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
    memberRef.current.value = "";
    alert("Add User to workspace.");
    setIsLoading(false);
  };

  const sendMessageHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (!messageRef.current?.value.trim() || !id) return;
    const newMessage = messageRef.current?.value.trim();
    const newId = uuidv4();
    const newMessageRef = doc(db, "chatRooms", id, "messages", newId);
    await setDoc(newMessageRef, {
      message: newMessage,
      userID: currentUser.uid,
      time: serverTimestamp(),
      id: newId,
    });
    messageRef.current.value = "";
  };

  useEffect(() => {
    getProjectHandler();
  }, []);

  useEffect(() => {
    if (!id) return;
    const chatRoomRef = query(
      collection(db, "chatRooms", id, "messages"),
      orderBy("time", "asc")
    );
    const unsubscribe = onSnapshot(chatRoomRef, (querySnapshot) => {
      const data = querySnapshot.docs;
      const messageFormat: MessageInterface[] = [];
      const messageList = produce(messageFormat, (draftState) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as MessageInterface;
          draftState.push(data);
        });
      });
      setMessages(messageList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const projectList = () => {
    return (
      <>
        {isExist && (
          <ProjectCardWrapper>
            <NewProject onSubmit={newProjectHandler} />

            {projects.map((project) => {
              return (
                <ProjectCard
                  key={project.id}
                  onClick={() => {
                    navigate(`/project/${project.id}`);
                  }}
                >
                  <ProjectCardTitle>{project.title}</ProjectCardTitle>
                </ProjectCard>
              );
            })}
          </ProjectCardWrapper>
        )}
        {isExist === false && <ErrorText>workspace not exist.</ErrorText>}
      </>
    );
  };

  const chatRoom = () => {
    return (
      <ChatRoomWrapper>
        <div>chatroom</div>
        {messages.length > 0 &&
          messages.map((message) => {
            return (
              <div
                key={message.id}
              >{`${message.userID}:${message.message}`}</div>
            );
          })}
        <MessageInputForm onSubmit={sendMessageHandler}>
          <MessageInput type="text" ref={messageRef} />
          <MessageButton>send message</MessageButton>
        </MessageInputForm>
      </ChatRoomWrapper>
    );
  };

  return (
    <PrivateRoute>
      <Wrapper>
        <WorkspaceSidebar isShow={isShowSidebar} />
        <ShowSidebarButton
          isShowSidebar={isShowSidebar}
          onClick={() => {
            setIsShowSidebar((prev) => !prev);
          }}
        >
          {isShowSidebar ? "<" : ">"}
        </ShowSidebarButton>
        {/* <SidebarWrapper>
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
          <ChatRoomButton
            onClick={() => {
              setIsShowChatRoom((prev) => !prev);
            }}
          >
            chat room
          </ChatRoomButton>
        </SidebarWrapper> */}
        <ProjectsWrapper isShowSidebar={isShowSidebar}>
          <WorkspaceBanner>{title}</WorkspaceBanner>
          {projectList()}
        </ProjectsWrapper>
        <>{isShowChatRoom && chatRoom()}</>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
