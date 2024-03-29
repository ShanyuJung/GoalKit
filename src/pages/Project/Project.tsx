import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { db } from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import CardDetail from "./components/detail/CardDetail";
import CardFilter from "./components/CardFilter";
import List from "./components/List";
import Modal from "../../components/modal/Modal";
import NewList from "./components/NewList";
import OnlineMembers from "./components/OnlineMembers";
import { PrivateRoute } from "../../components/route/PrivateRoute";
import ProjectSidebar from "./components/ProjectSidebar";
import SidebarButton from "../../components/layout/sidebar/SidebarButton";
import styled from "styled-components";
import produce from "immer";
import Swal from "sweetalert2";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import {
  ListInterface,
  MemberInterface,
  ProjectInterface,
  WorkspaceInterface,
} from "../../types";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const BorderWrapper = styled.div<{ isShowSidebar: boolean }>`
  height: calc(100vh - 70px);
  flex-grow: 1;
  margin-left: ${(props) => (props.isShowSidebar ? "260px" : "30px")};
  transition: margin 0.3s;
  overflow: hidden;

  @media (max-width: 808px) {
    margin-left: 0px;
  }
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) =>
    props.isShowSidebar ? "calc(100vw - 260px)" : "calc(100% - 30px)"};
  height: 40px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #fff;
  z-index: 9;
  transition: width 0.3s;
  gap: 20px;
  min-width: 360px;

  @media (max-width: 808px) {
    width: 100%;
  }
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  font-weight: bolder;
  flex-grow: 1;
`;

const Wrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const ListWrapper = styled.div`
  padding: 10px 20px 10px 20px;
  display: flex;
  /* width: fit-content; */
  overflow: auto;
  height: calc(100vh - 70px - 40px);
`;

const ErrorText = styled.div`
  margin-top: 40px;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  text-align: center;
`;

export const checkPermissionHandler = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params.workspaceID || !params.projectID) return null;
  try {
    const workspaceRef = doc(db, "workspaces", params.workspaceID);
    const workspaceDocSnap = await getDoc(workspaceRef);
    if (!workspaceDocSnap.exists()) {
      Swal.fire("Error", "Workspace is not exist!", "warning");
      return null;
    }
    const workspaceResponse = workspaceDocSnap.data() as WorkspaceInterface;
    const projectIDs = workspaceResponse.projects.map((project) => {
      return project.id;
    });

    if (!projectIDs.includes(params.projectID)) {
      Swal.fire("Error", "Project is not exist!", "warning");
      return null;
    }

    const response = workspaceResponse;
    return response;
  } catch (e) {
    if (
      e instanceof Error &&
      e.message === "Missing or insufficient permissions."
    ) {
      Swal.fire(
        "Authentication Error!",
        "Please login before start your work.",
        "warning"
      );
      return;
    }
    Swal.fire(
      "Failed to connect server!",
      "Please check your internet connection and try again later",
      "warning"
    );
  }
};

const Project = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [isPermission, setIsPermission] = useState<boolean>(false);
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [project, setProject] =
    useState<ProjectInterface | undefined>(undefined);
  const [members, setMembers] = useState<MemberInterface[]>([]);
  const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(true);
  const navigate = useNavigate();
  const { workspaceID, projectID, cardID } = useParams();
  const response = useLoaderData() as WorkspaceInterface | null;
  const { currentUser } = useAuth();
  const [keyword, setKeyword] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const updateDataHandler = async (newList: ListInterface[]) => {
    if (!projectID || isLoading) return;

    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", projectID);
      await updateDoc(projectRef, { lists: newList });
    } catch {
      Swal.fire("Something went wrong!", "Please try again later", "warning");
    }
    setIsLoading(false);
  };

  const isDraggingHandler = async ({ draggableId, type }: DragStart) => {
    if (!projectID || isLoading || !currentUser) return;
    const projectRef = doc(db, "projects", projectID);
    if (type === "BOARD") {
      const draggingObj = {
        listID: draggableId,
        displayName: currentUser.displayName,
      };
      await updateDoc(projectRef, { draggingLists: arrayUnion(draggingObj) });
    }
    if (type === "LIST") {
      const draggingObj = {
        cardID: draggableId,
        displayName: currentUser.displayName,
      };
      await updateDoc(projectRef, { draggingCards: arrayUnion(draggingObj) });
    }
  };

  const isDroppedHandler = async (draggableId: string, type: string) => {
    if (!projectID || isLoading || !currentUser) return;
    const projectRef = doc(db, "projects", projectID);
    if (type === "BOARD") {
      const draggingObj = {
        listID: draggableId,
        displayName: currentUser.displayName,
      };
      await updateDoc(projectRef, { draggingLists: arrayRemove(draggingObj) });
    }
    if (type === "LIST") {
      const draggingObj = {
        cardID: draggableId,
        displayName: currentUser.displayName,
      };
      await updateDoc(projectRef, { draggingCards: arrayRemove(draggingObj) });
    }
  };

  const onDragEndHandler = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    isDroppedHandler(draggableId, result.type);
    if (!destination || isLoading) return;

    try {
      if (result.type === "BOARD") {
        const newLists = produce(lists, (draftState) => {
          const [newOrder] = draftState.splice(source.index, 1);
          draftState.splice(destination.index, 0, newOrder);
        });
        setLists(newLists);
        updateDataHandler(newLists);
      }

      if (result.type === "LIST") {
        const newLists = produce(lists, (draftState) => {
          const prevListIndex = draftState.findIndex((item) => {
            return item.id === source.droppableId;
          });
          const newListIndex = draftState.findIndex((item) => {
            return item.id === destination.droppableId;
          });

          const [newOrder] = draftState[prevListIndex].cards.splice(
            source.index,
            1
          );
          draftState[newListIndex].cards.splice(destination.index, 0, newOrder);
        });
        setLists(newLists);
        updateDataHandler(newLists);
      }
    } catch {
      Swal.fire("Something went wrong!", "Please, try again later.", "warning");
    }
  };

  const newCardHandler = (newCardTitle: string, parentID: string) => {
    const newId = uuidv4();
    const newCard = { id: newId, title: newCardTitle };
    const newLists = produce(lists, (draftState) => {
      const listIndex = lists.findIndex((item) => item.id === parentID);
      draftState[listIndex].cards.push(newCard);
    });

    updateDataHandler(newLists);
  };

  const newListHandler = (newListTitle: string) => {
    const newId = uuidv4();
    const newList = { id: newId, title: newListTitle, cards: [] };
    const newLists = produce(lists, (draftState) => {
      draftState.push(newList);
    });

    updateDataHandler(newLists);
  };

  const deleteCardHandler = async (targetCardID: string) => {
    const parentIndex = lists.findIndex((list) => {
      return list.cards.find((card) => card.id === targetCardID);
    });
    const targetIndex = lists[parentIndex].cards.findIndex((card) => {
      return card.id === targetCardID;
    });

    const newLists = produce(lists, (draftState) => {
      draftState[parentIndex].cards.splice(targetIndex, 1);
    });

    updateDataHandler(newLists);
  };

  const deleteListHandler = (targetListID: string) => {
    const newLists = produce(lists, (draftState) => {
      const deleteListIndex = draftState.findIndex(
        (list) => list.id === targetListID
      );
      draftState.splice(deleteListIndex, 1);
    });

    updateDataHandler(newLists);
  };

  const moveAllCardsHandler = (curListID: string, targetListID: string) => {
    const newList = produce(lists, (draftState) => {
      const curIndex = draftState.findIndex((list) => list.id === curListID);
      const targetIndex = draftState.findIndex(
        (list) => list.id === targetListID
      );
      draftState[curIndex].cards = [];
      draftState[targetIndex].cards.push(...lists[curIndex].cards);
    });

    updateDataHandler(newList);
    const targetList = lists.find((list) => list.id === targetListID);
    Swal.fire("Succeed!", `Move all cards to ${targetList?.title}`, "success");
  };

  const onCloseHandler = () => {
    navigate(`/workspace/${workspaceID}/project/${projectID}`);
  };

  useEffect(() => {
    if (!keyword.trim()) {
      setIsFiltered(false);
      return;
    }
    setIsFiltered(true);
  }, [keyword]);

  useEffect(() => {
    const getMembersHandler = async (members: string[]) => {
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

      setMembers(curMembers);
    };

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
          setMemberIDs(response.members);
          await getMembersHandler(response.members);
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
    if (!projectID || !isPermission) return;
    const projectRef = doc(db, "projects", projectID);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        const newProject = snapshot.data() as ProjectInterface;
        setProject(newProject);
        setLists(snapshot.data()?.lists);
      } else {
        setIsExist(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isPermission]);

  const renderProjectBoard = () => {
    return (
      <Droppable
        droppableId={projectID || "default"}
        direction="horizontal"
        type="BOARD"
      >
        {(provided) => (
          <Wrapper {...provided.droppableProps} ref={provided.innerRef}>
            <ListWrapper>
              {lists.length > 0 &&
                lists.map((list, index) => {
                  return (
                    <Draggable
                      key={`draggable-${list.id}`}
                      draggableId={list.id}
                      index={index}
                      isDragDisabled={
                        isFiltered ||
                        project?.draggingLists?.some(
                          (draggingList) => draggingList.listID === list.id
                        ) ||
                        false
                      }
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-is-dragging={
                            snapshot.isDragging && !snapshot.isDropAnimating
                          }
                        >
                          <List
                            title={list.title}
                            cards={list.cards}
                            key={list.id}
                            newCardHandler={newCardHandler}
                            id={list.id}
                            tags={project?.tags || undefined}
                            members={members}
                            draggingLists={project?.draggingLists || undefined}
                            draggingCards={project?.draggingCards || undefined}
                            deleteList={deleteListHandler}
                            lists={lists}
                            moveAllCardsHandler={moveAllCardsHandler}
                            isFilter={isFiltered}
                            keyword={keyword}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
              <NewList onSubmit={newListHandler} />
            </ListWrapper>
          </Wrapper>
        )}
      </Droppable>
    );
  };

  return (
    <PrivateRoute>
      <>
        {cardID !== undefined && (
          <Modal onClose={onCloseHandler}>
            {lists.length > 0 ? (
              <CardDetail
                listsArray={[...lists]}
                tags={project?.tags || undefined}
                members={members}
                onDelete={deleteCardHandler}
                onClose={onCloseHandler}
                draggingLists={project?.draggingLists}
                draggingCards={project?.draggingCards}
              />
            ) : null}
          </Modal>
        )}
        <Container>
          <ProjectSidebar
            isShow={isShowSidebar}
            onClose={() => {
              setIsShowSidebar((prevIsShowSidebar) => !prevIsShowSidebar);
            }}
          />
          <SidebarButton
            isShowSidebar={isShowSidebar}
            setIsShowSidebar={setIsShowSidebar}
          />
          <BorderWrapper isShowSidebar={isShowSidebar}>
            <SubNavbar isShowSidebar={isShowSidebar}>
              <TitleWrapper>
                {project !== undefined && isPermission && project.title}
              </TitleWrapper>
              <CardFilter keyword={keyword} setKeyword={setKeyword} />
              <OnlineMembers memberIDs={memberIDs} />
            </SubNavbar>
            <DragDropContext
              onDragEnd={onDragEndHandler}
              onDragStart={isDraggingHandler}
            >
              {isExist && isPermission && renderProjectBoard()}
              {isExist === false && (
                <ErrorText>Project is not exist.</ErrorText>
              )}
              {isExist && !isPermission && (
                <ErrorText>
                  You do not have permission to enter this workspace.
                </ErrorText>
              )}
            </DragDropContext>
          </BorderWrapper>
        </Container>
      </>
    </PrivateRoute>
  );
};

export default Project;
