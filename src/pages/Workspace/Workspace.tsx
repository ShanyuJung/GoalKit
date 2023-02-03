import { useEffect, useState, useRef, FormEvent } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  LoaderFunctionArgs,
} from "react-router-dom";
import { db } from "../../firebase";
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
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import Message from "./components/Message";
import NewProject from "./components/NewProject";
import { PrivateRoute } from "../../components/route/PrivateRoute";
import SidebarButton from "../../components/layout/sidebar/SidebarButton";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import styled from "styled-components";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { ReactComponent as sendIcon } from "../../assets/send-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../assets/close-svgrepo-com.svg";
import { ReactComponent as deleteIcon } from "../../assets/remove-user-svgrepo-com.svg";
import { MemberInterface, WorkspaceInterface } from "../../types";

const Wrapper = styled.div`
  display: flex;
  min-width: 360px;
`;

const ProjectsWrapper = styled.div<{ isShowSidebar: boolean }>`
  height: calc(100vh - 70px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "30px")};
  transition: padding 0.3s;
  overflow: auto;

  @media (max-width: 808px) {
    padding-left: 0px;
  }
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
  word-wrap: break-word;
  hyphens: auto;

  @media (max-width: 808px) {
    font-size: 28px;
    min-height: 80px;
  }
`;

const ProjectCardWrapper = styled.div`
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

  @media (max-width: 549px) {
    justify-content: center;
  }
`;

const ProjectCard = styled.div`
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

const ProjectCardTitle = styled.div`
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
  right: 20px;
  bottom: 0;
  width: 340px;
  height: 450px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f2f2f2;
  box-shadow: 6px -6px 20px rgba(0, 0, 0, 0.35);
`;

const ChatRoomHeader = styled.div`
  min-height: 40px;
  background-color: #2c4859;
  font-size: 20px;
  line-height: 40px;
  padding: 0px 10px;
  color: #f2f2f2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: default;
`;

const MessageArea = styled.div`
  overflow-y: auto;
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
    filter: brightness(120%);
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
  margin: 15px;
  width: 80%;

  @media (max-width: 900px) {
    width: 100%;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MemberInput = styled.input`
  margin: 0;
  font-size: 20px;
  line-height: 40px;
  height: 40px;
  border-radius: 20px;
  padding: 0px 20px;
  border: 1px solid #ccc;
  flex-grow: 1;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const MemberButton = styled.button`
  color: #fff;
  background-color: #658da6;
  border: none;
  margin: 10px;
  font-size: 16px;
  width: 120px;
  border-radius: 5px;
  margin: 0;
  padding: 5px;
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;

  &:hover {
    filter: brightness(110%);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const MemberWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px #658da6 solid;

  &:hover {
    background-color: #eee;
  }

  @media (max-width: 900px) {
    width: 100%;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 0px;
  }
`;

const MemberName = styled.div`
  font-size: 22px;
  line-height: 22px;
  width: 150px;
  color: #1d3240;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const MemberEmail = styled.div`
  flex-grow: 1;
  font-size: 16px;
  line-height: 22px;
  color: #658da6;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const MemberType = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #1d3240;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const DeleteIcon = styled(deleteIcon)`
  width: 16px;
  height: 16px;
  cursor: pointer;

  ellipse {
    fill: #ccc;
  }

  path {
    fill: #ccc;
  }

  &:hover {
    ellipse {
      fill: #555;
    }
    path {
      fill: #555;
    }
  }
`;

const PlaceholderBlock = styled.div`
  width: 16px;
  height: 16px;
`;

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
  if (!params.workspaceID) return null;
  try {
    const workspaceRef = doc(db, "workspaces", params.workspaceID);
    const docSnap = await getDoc(workspaceRef);
    if (docSnap.exists()) {
      const response = docSnap.data();
      return response;
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

const Workspace = () => {
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [membersInfo, setMembersInfo] = useState<MemberInterface[]>([]);
  const [contentType, setContentType] = useState<string>("project");
  const [ownerID, setOwnerID] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isShowChatRoom, setIsShowChatRoom] = useState<boolean>(false);
  const memberRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const chatRoomRef = useRef<null | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const navigate = useNavigate();
  const { workspaceID } = useParams();
  const { currentUser } = useAuth();
  const response = useLoaderData() as Response | null;

  const newProjectHandler = async (projectTitle: string) => {
    if (!workspaceID || isLoading) return;
    if (currentUser?.uid !== ownerID) {
      Swal.fire(
        "Permission Error!",
        "Only workspace owner can create new project.",
        "warning"
      );

      return;
    }

    try {
      setIsLoading(true);
      const setRef = doc(collection(db, "projects"));
      const newProject = {
        id: setRef.id,
        lists: [],
        title: projectTitle,
        workspaceID: workspaceID,
      };
      await setDoc(setRef, newProject);
      const docRef = doc(db, "workspaces", workspaceID);
      const newObj = {
        id: setRef.id,
        title: projectTitle,
      };
      await updateDoc(docRef, { projects: arrayUnion(newObj) });
      Swal.fire("Succeed!", "Build new project succeed!", "success");
      navigate(`/workspace/${workspaceID}`);
    } catch (e) {
      Swal.fire(
        "Failed to create project!",
        "Please check your internet connection and try again later",
        "warning"
      );
    }
    setIsLoading(false);
  };

  const searchUserHandler = async (email: string) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const usersFormat: MemberInterface[] = [];
    const userList = produce(usersFormat, (draftState) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data() as MemberInterface;
        draftState.push(user);
      });
    });
    return userList;
  };

  const updateMemberHandler = async (userID: string) => {
    if (!workspaceID) return;
    const workspaceRef = doc(db, "workspaces", workspaceID);
    await updateDoc(workspaceRef, { members: arrayUnion(userID) });
  };

  const getMemberInfo = async (members: string[]) => {
    if (members.length === 0) return;
    const usersRef = collection(db, "users");
    const userQ = query(usersRef, where("uid", "in", members));
    const userQuerySnapshot = await getDocs(userQ);
    const emptyMemberArr: MemberInterface[] = [];
    const curMembers = produce(emptyMemberArr, (draftState) => {
      userQuerySnapshot.forEach((doc) => {
        const docData = doc.data() as MemberInterface;
        draftState.push(docData);
      });
    });
    setMembersInfo(curMembers);
  };

  const addMemberHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceID || !memberRef.current?.value.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const emailString = memberRef.current?.value.trim();
      const userList = await searchUserHandler(emailString);
      if (!userList || userList.length === 0) {
        Swal.fire("User not found!", "Try another email", "warning");
        setIsLoading(false);
        return;
      }
      const searchedUser = [...userList][0];
      await updateMemberHandler(searchedUser.uid);
      const workspaceRef = doc(db, "workspaces", workspaceID);
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        const response = docSnap.data() as WorkspaceInterface;
        getMemberInfo(response.members);
      }
      memberRef.current.value = "";
      Swal.fire("Succeed!", "Add User to workspace.", "success");
    } catch (e) {
      Swal.fire(
        "Failed to add member",
        "Please check your internet connection and try again later",
        "warning"
      );
    }

    setIsLoading(false);
  };

  const removeMemberHandler = async (userID: string) => {
    if (!workspaceID || isLoading || !userID) return;

    try {
      setIsLoading(true);
      const workspaceRef = doc(db, "workspaces", workspaceID);
      await updateDoc(workspaceRef, { members: arrayRemove(userID) });
      const docSnap = await getDoc(workspaceRef);
      if (docSnap.exists()) {
        const response = docSnap.data() as WorkspaceInterface;
        getMemberInfo(response.members);
      }
      Swal.fire("Succeed!", "Remove User to workspace.", "success");
    } catch {
      Swal.fire(
        "Failed to remove member",
        "Please check your internet connection and try again later",
        "warning"
      );
    }
    setIsLoading(false);
  };

  const checkRemoveMemberHandler = (
    userDisplayName: string,
    userID: string
  ) => {
    Swal.fire({
      title: `Confirm to remove ${userDisplayName} from workspace`,
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#658da6b4",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e74d3ce3",
    }).then((result) => {
      if (result.value === true) {
        removeMemberHandler(userID);
      }
    });
  };

  const sendMessageHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !currentUser ||
      !messageRef.current?.value.trim() ||
      !workspaceID ||
      isSending
    ) {
      return;
    }
    try {
      setIsSending(true);
      const newMessage = messageRef.current?.value.trim();
      const newId = uuidv4();
      const newMessageRef = doc(
        db,
        "chatRooms",
        workspaceID,
        "messages",
        newId
      );
      await setDoc(newMessageRef, {
        message: newMessage,
        userID: currentUser.uid,
        time: serverTimestamp(),
        id: newId,
      });
    } catch {
      Swal.fire(
        "Failed to send message",
        "Please check your internet connection and try again later",
        "warning"
      );
    }
    messageRef.current.value = "";
    setIsSending(false);
  };

  useEffect(() => {
    const projectsHandler = async () => {
      if (isLoading) return;
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

      if (currentUser && response.members.includes(currentUser?.uid)) {
        try {
          setIsLoading(true);
          setIsExist(true);
          setIsPermission(true);
          setProjects(response.projects);
          setTitle(response.title);
          setOwnerID(response.owner);
          await getMemberInfo(response.members);
        } catch {
          setIsLoading(false);
          Swal.fire(
            "Failed to fetch data",
            "Please check your internet connection and try again later",
            "warning"
          );
        }
        setIsLoading(false);
      }
    };

    projectsHandler();
  }, [response]);

  useEffect(() => {
    if (!workspaceID || !isPermission) return;
    const chatRoomRef = query(
      collection(db, "chatRooms", workspaceID, "messages"),
      orderBy("time", "asc")
    );
    const unsubscribe = onSnapshot(chatRoomRef, (querySnapshot) => {
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
  }, [isPermission, workspaceID]);

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

  const renderProjectList = () => {
    return (
      <>
        {isExist && isPermission && (
          <ProjectCardWrapper>
            <NewProject onSubmit={newProjectHandler} />
            {projects.length > 0 &&
              projects.map((project) => {
                return (
                  <ProjectCard
                    key={project.id}
                    onClick={() => {
                      navigate(
                        `/workspace/${workspaceID}/project/${project.id}`
                      );
                    }}
                  >
                    <ProjectCardTitle>{project.title}</ProjectCardTitle>
                  </ProjectCard>
                );
              })}
          </ProjectCardWrapper>
        )}
        {isExist === false && <ErrorText>workspace is not exist.</ErrorText>}
        {isExist && !isPermission && (
          <ErrorText>
            You do not have permission to enter this workspace.
          </ErrorText>
        )}
      </>
    );
  };

  const renderMemberList = () => {
    const displayMember = produce(membersInfo, (draftState) => {
      const index = draftState.findIndex((member) => member.uid === ownerID);
      const [owner] = draftState.splice(index, 1);
      draftState.splice(0, 0, owner);
    });

    return (
      <>
        {isExist && isPermission && (
          <>
            <MemberContainer>
              <MemberForm onSubmit={addMemberHandler}>
                <MemberInput
                  placeholder="Enter email to add member"
                  type="email"
                  required
                  ref={memberRef}
                />
                <MemberButton>Add member</MemberButton>
              </MemberForm>
              {displayMember.map((member, index) => {
                return (
                  <MemberWrapper key={`member-${index + 1}`}>
                    <MemberName>{member?.displayName}</MemberName>
                    <MemberEmail>{member?.email}</MemberEmail>
                    <MemberType>
                      {member?.uid === ownerID ? "Owner" : "Member"}
                    </MemberType>
                    {currentUser?.uid === ownerID && member?.uid !== ownerID ? (
                      <DeleteIcon
                        onClick={() => {
                          checkRemoveMemberHandler(
                            member?.displayName,
                            member?.uid
                          );
                        }}
                      />
                    ) : (
                      <PlaceholderBlock />
                    )}
                  </MemberWrapper>
                );
              })}
            </MemberContainer>
          </>
        )}
        {isExist === false && <ErrorText>workspace is not exist.</ErrorText>}
        {isExist && !isPermission && (
          <ErrorText>
            You do not have permission to enter this workspace.
          </ErrorText>
        )}
      </>
    );
  };

  const renderChatRoom = () => {
    if (!isExist || membersInfo.length === 0 || !isPermission) return null;
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
            messages.map(({ userID, id, message, time }) => {
              const index = membersInfo.findIndex(
                (member) => member.uid === userID
              );
              return (
                <Message
                  key={id}
                  messageUserID={userID}
                  userFirstChar={
                    membersInfo[index]?.displayName.charAt(0) || ""
                  }
                  messageText={message}
                  messageTime={time}
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
          onClose={() => {
            setIsShowSidebar((prevIsShowSidebar) => !prevIsShowSidebar);
          }}
        />
        <SidebarButton
          isShowSidebar={isShowSidebar}
          setIsShowSidebar={setIsShowSidebar}
        />
        <ProjectsWrapper isShowSidebar={isShowSidebar}>
          {isPermission && <WorkspaceBanner>{title}</WorkspaceBanner>}
          {contentType === "project" && renderProjectList()}
          {contentType === "member" && renderMemberList()}
        </ProjectsWrapper>
        {isShowChatRoom && renderChatRoom()}
      </Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
