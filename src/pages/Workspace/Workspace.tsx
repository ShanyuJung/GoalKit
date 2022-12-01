import { useEffect, useState, useRef, FormEvent } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  LoaderFunctionArgs,
} from "react-router-dom";
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
import { ReactComponent as sendIcon } from "../../assets/send-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../assets/close-svgrepo-com.svg";
import Swal from "sweetalert2";
import Message from "./components/Message";

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
  overflow: scroll;
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
  max-width: 1160px;
  margin: 0px auto;
  padding: 35px 50px;
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
  background-color: #fff;
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

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 50px;
  align-items: center;
`;

const MemberForm = styled.form`
  display: flex;
  gap: 10px;
`;

const MemberInput = styled.input`
  font-size: 18px;
  width: 250px;
`;

const MemberButton = styled.button`
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 10px;
  font-size: 16px;
  width: 120px;
  border-radius: 5px;
  margin: 0;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

const MemberWrapper = styled.div`
  display: flex;
  align-items: center;

  width: 60%;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px #ccc solid;

  &:hover {
    background-color: #eee;
  }
`;

const MemberName = styled.div`
  font-size: 22px;
  width: 150px;
`;

const MemberEmail = styled.div`
  flex-grow: 1;
  font-size: 16px;
  color: #555;
`;

const MemberType = styled.div`
  font-size: 20px;
`;

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

interface MessageInterface {
  userID: string;
  time: Timestamp;
  message: string;
  id: string;
}

interface Response {
  id: string;
  title: string;
  projects: { id: string; title: string }[];
  owner: string;
  members: string[];
}

export const getProjectsHandler = async ({ params }: LoaderFunctionArgs) => {
  if (!params.id) return null;
  try {
    const workspaceRef = doc(db, "workspaces", params.id);
    const docSnap = await getDoc(workspaceRef);
    if (docSnap.exists()) {
      const response = docSnap.data();
      return response;
    }
    Swal.fire("Error", "Workspace is not exist!", "warning");
    return null;
  } catch {
    Swal.fire(
      "Failed to connect server!",
      "Please check your internet is connected and try again later",
      "warning"
    );
  }
};

const Workspace = () => {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [membersInfo, setMembersInfo] = useState<Member[]>([]);
  const [contentType, setContentType] = useState("project");
  const [ownerID, setOwnerID] = useState("");
  const [title, setTitle] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isShowChatRoom, setIsShowChatRoom] = useState<boolean>(false);
  const memberRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const chatRoomRef = useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const response = useLoaderData() as Response | null;

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
      Swal.fire("Succeed!", "Build new project succeed!", "success");
      navigate(`/workspace/${id}`);
    } catch (e) {
      Swal.fire(
        "Failed to create project!",
        "Please check your internet is connected and try again later",
        "warning"
      );
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
    if (!id) return;
    const workspaceRef = doc(db, "workspaces", id);
    await updateDoc(workspaceRef, { members: arrayUnion(userID) });
  };

  const addMemberHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !memberRef.current?.value.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const emailString = memberRef.current?.value.trim();
      const userList = await searchUserHandler(emailString);
      if (!userList || userList.length === 0) {
        Swal.fire("User not found!", "Try another email", "warning");
        return;
      }
      const searchedUser = [...userList][0];
      await updateMemberHandler(searchedUser.uid);
      const workspaceRef = doc(db, "workspaces", id);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        setMemberIDs(docSnap.data().members);
      }
      memberRef.current.value = "";
      Swal.fire("Succeed!", "Add User to workspace.", "success");
    } catch (e) {
      Swal.fire(
        "Failed to add member",
        "Please check your internet is connected and try again later",
        "warning"
      );
    }

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
    if (!response) {
      setIsExist(false);
      return;
    }
    setIsExist(true);
    setProjects(response.projects);
    setTitle(response.title);
    setMemberIDs(response.members);
    setOwnerID(response.owner);
  }, [response]);

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

  useEffect(() => {
    const scrollToBottomHandler = () => {
      if (!chatRoomRef.current) return;
      chatRoomRef.current?.scrollIntoView();
    };

    scrollToBottomHandler();
  }, [isShowChatRoom]);

  useEffect(() => {
    const scrollToBottomHandler = () => {
      if (!chatRoomRef.current) return;

      chatRoomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottomHandler();
  }, [messages]);

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
        {isExist === false && <ErrorText>workspace is not exist.</ErrorText>}
      </>
    );
  };

  const memberList = () => {
    const displayMember = produce(membersInfo, (draftState) => {
      const index = draftState.findIndex((member) => member.uid === ownerID);
      const [owner] = draftState.splice(index, 1);
      draftState.splice(0, 0, owner);
    });

    return (
      <>
        {isExist && (
          <>
            <MemberContainer>
              <MemberForm onSubmit={addMemberHandler}>
                <MemberInput
                  placeholder="Enter email to add member"
                  type="text"
                  required
                  ref={memberRef}
                />
                <MemberButton>Add member</MemberButton>
              </MemberForm>
              {displayMember.map((member) => {
                return (
                  <MemberWrapper key={member.uid}>
                    <MemberName>{member.displayName}</MemberName>
                    <MemberEmail>{member.email}</MemberEmail>
                    <MemberType>
                      {member.uid === ownerID ? "Owner" : "Member"}
                    </MemberType>
                  </MemberWrapper>
                );
              })}
            </MemberContainer>
          </>
        )}
        {isExist === false && <ErrorText>workspace is not exist.</ErrorText>}
      </>
    );
  };

  const chatRoom = () => {
    if (!isExist || membersInfo.length === 0) return <></>;
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
                <Message
                  key={message.id}
                  messageUserID={message.userID}
                  userFirstChar={
                    membersInfo[index]?.displayName.charAt(0) || ""
                  }
                  messageText={message.message}
                  messageTime={message.time}
                  messagePhoto={membersInfo[index]?.photoURL || ""}
                />
              );
            })}
          <div ref={chatRoomRef} />
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
          contentType={contentType}
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
