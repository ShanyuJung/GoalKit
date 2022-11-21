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
import MemberList from "./components/MemberList";
import { ReactComponent as sendIcon } from "../../assets/send-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../assets/close-svgrepo-com.svg";

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

const SubBanner = styled.div;

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
  z-index: 20;
  right: 10px;
  bottom: 0;
  width: 340px;
  height: 450px;
  border: 1px #ddd solid;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatRoomHeader = styled.div`
  height: 40px;
  background-color: #ddd;
  font-size: 20px;
  line-height: 40px;
  padding: 0px 5px;
`;

const MessageArea = styled.div`
  overflow-y: scroll;
  flex-grow: 1;

  padding: 5px 10px;
`;

const MessageWrapper = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isCurrentUser ? " row-reverse" : "row")};
  width: 100%;
  align-items: flex-end;
  margin: 10px 0px;
  gap: 10px;
`;

const MessageUserIcon = styled.div<{ isCurrentUser: boolean }>`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  flex-shrink: 0;
  background-color: ${(props) => (props.isCurrentUser ? "#2196f3" : "#81c784")};
`;

const Message = styled.div<{ isCurrentUser: boolean }>`
  max-width: 230px;
  position: relative;
  z-index: 1;
  padding: 2px 10px;
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
  border-radius: 5px;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    opacity: 0.6;
    border-radius: 5px;
    background-color: ${(props) => (props.isCurrentUser ? "#2196f3" : "#ccc")};
  }
`;

const MessageInputForm = styled.form`
  width: 100%;
  position: relative;
  top: 0px;
  background-color: #ddd;
`;

const MessageInputWrapper = styled.div`
  height: 30px;
  display: flex;
  height: 40px;
`;

const MessageInput = styled.input`
  outline: none;
  padding: 0px 10px;
  flex-grow: 1;
  border: none;
  background-color: transparent;
`;

const MessageButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const SendIcon = styled(sendIcon)`
  width: 25px;
  height: 25px;
`;

const CloseButton = styled(closeIcon)`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;

  path {
    fill: #999;
  }

  &:hover {
    path {
      fill: #555;
    }
  }
`;

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
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
  const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [membersInfo, setMembersInfo] = useState<Member[]>([]);
  const [contentType, setContentType] = useState("project");
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
        setMemberIDs(docSnap.data().members);
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
    const usersFormat: Member[] = [];
    const userList = produce(usersFormat, (draftState) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data() as Member;
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
    const getMemberInfo = async () => {
      if (memberIDs.length === 0) return;
      const usersRef = collection(db, "users");
      const userQ = query(usersRef, where("uid", "in", memberIDs));
      const userQuerySnapshot = await getDocs(userQ);
      const emptyMemberArr: Member[] = [];
      const curMembers = produce(emptyMemberArr, (draftState) => {
        userQuerySnapshot.forEach((doc) => {
          const docData = doc.data() as Member;
          draftState.push(docData);
        });
      });
      setMembersInfo(curMembers);
    };

    getMemberInfo();
  }, [memberIDs]);

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

  const memberList = () => {
    return (
      <>
        {isExist && (
          <>
            {membersInfo.map((member) => {
              return <div>{member.displayName}</div>;
            })}
          </>
        )}
        {isExist === false && <ErrorText>workspace not exist.</ErrorText>}
      </>
    );
  };

  const chatRoom = () => {
    return (
      <ChatRoomWrapper>
        <ChatRoomHeader>{`Chatroom of ${title}`}</ChatRoomHeader>
        <CloseButton
          onClick={() => {
            setIsShowChatRoom(false);
          }}
        />
        <MessageArea>
          {messages.length > 0 &&
            messages.map((message) => {
              const index = membersInfo.findIndex(
                (member) => member.uid === message.userID
              );
              return (
                <MessageWrapper
                  key={message.id}
                  isCurrentUser={currentUser.uid === message.userID}
                >
                  <MessageUserIcon
                    isCurrentUser={currentUser.uid === message.userID}
                  >{`${membersInfo[index].displayName.charAt(
                    0
                  )}`}</MessageUserIcon>
                  <Message
                    isCurrentUser={currentUser.uid === message.userID}
                  >{`${message.message}`}</Message>
                </MessageWrapper>
              );
            })}
        </MessageArea>
        <MessageInputForm onSubmit={sendMessageHandler}>
          <MessageInputWrapper>
            <MessageInput
              type="text"
              ref={messageRef}
              placeholder="Type a message..."
            />
            <MessageButton>
              <SendIcon />
            </MessageButton>
          </MessageInputWrapper>
        </MessageInputForm>
      </ChatRoomWrapper>
    );
  };

  return (
    <PrivateRoute>
      <Wrapper>
        <WorkspaceSidebar
          isShow={isShowSidebar}
          setContentType={setContentType}
          setIsShowChatRoom={setIsShowChatRoom}
        />
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
          {contentType === "project" ? projectList() : <></>}
          {contentType === "member" ? memberList() : <></>}
        </ProjectsWrapper>
        <>{isShowChatRoom && chatRoom()}</>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
