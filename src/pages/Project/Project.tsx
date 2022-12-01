import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import List from "./components/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import produce from "immer";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import NewList from "./components/NewList";
import { v4 as uuidv4 } from "uuid";
import {
  useNavigate,
  useParams,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import CardDetail from "./components/detail/CardDetail";
import ProjectSidebar from "./components/ProjectSidebar";
import OnlineMembers from "./components/OnlineMembers";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import CardFilter from "./components/CardFilter";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const BorderWrapper = styled.div<{ isShowSidebar: boolean }>`
  height: calc(100vh - 50px);
  flex-grow: 1;
  margin-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: margin 0.3s;
  overflow: scroll;
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) => (props.isShowSidebar ? "calc(100vw - 260px)" : "100%")};
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
  width: fit-content;
  overflow-x: scroll;
  height: calc(100vh - 50px - 40px);
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

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface ProjectInterface {
  id: string;
  title: string;
  lists: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  draggingLists?: { listID: string; displayName: string }[];
  draggingCards?: { cardID: string; displayName: string }[];
}

interface Workspace {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

export const firstRenderProjectHandler = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params.id) return null;
  try {
    const projectRef = doc(db, "projects", params.id);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      const response = docSnap.data();
      return response;
    }
    Swal.fire("Error", "Workspace is not exist!", "warning");
    return null;
  } catch (e) {
    Swal.fire(
      "Failed to connect server!",
      "Please check your internet is connected and try again later",
      "warning"
    );
  }
};

const Project = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [project, setProject] = useState<ProjectInterface | undefined>(
    undefined
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [memberIDs, setMemberIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const navigate = useNavigate();
  const { id, cardId } = useParams();
  const response = useLoaderData() as ProjectInterface;
  const { currentUser } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setIsFilter(false);
      return;
    }
    setIsFilter(true);
  }, [keyword]);

  useEffect(() => {
    if (!response) {
      setIsExist(false);
      return;
    }
    setIsExist(true);
    setProject(response);
    setLists(response.lists);
  }, [response]);

  const updateDataHandler = async (newList: ListInterface[]) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, { lists: newList });
    } catch {
      Swal.fire("Something went wrong!", "Please try again later", "warning");
    }
    setIsLoading(false);
  };

  const isDraggingHandler = async ({ draggableId, type }: DragStart) => {
    if (!id || isLoading || !currentUser) return;
    const projectRef = doc(db, "projects", id);
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
    if (!id || isLoading || !currentUser) return;
    const projectRef = doc(db, "projects", id);
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

  const deleteCardHandler = (targetCardID: string) => {
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
    navigate(`/project/${id}`);
  };

  useEffect(() => {
    const getMembersHandler = async () => {
      if (!project) return;
      const workspaceRef = collection(db, "workspaces");
      const q = query(
        workspaceRef,
        where("projects", "array-contains-any", [
          { id: id, title: project?.title },
        ])
      );
      const querySnapshot = await getDocs(q);
      const emptyWorkspaceArr: Workspace[] = [];
      const curWorkspaces = produce(emptyWorkspaceArr, (draftState) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data() as Workspace;
          draftState.push(docData);
        });
      });
      const usersRef = collection(db, "users");
      const userQ = query(
        usersRef,
        where("uid", "in", curWorkspaces[0].members)
      );
      const userQuerySnapshot = await getDocs(userQ);
      const emptyMemberArr: Member[] = [];
      const curMembers = produce(emptyMemberArr, (draftState) => {
        userQuerySnapshot.forEach((doc) => {
          const docData = doc.data() as Member;
          draftState.push(docData);
        });
      });
      setMemberIDs(curWorkspaces[0].members);
      setMembers(curMembers);
    };

    getMembersHandler();
  }, [project]);

  useEffect(() => {
    if (!id) return;
    const projectRef = doc(db, "projects", id);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        const newProject = snapshot.data() as ProjectInterface;
        setProject(newProject);
        setLists(snapshot.data()?.lists);
      } else setIsExist(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const projectBoard = () => {
    return (
      <Droppable
        droppableId={id || "default"}
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
                        isFilter ||
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
                            isFilter={isFilter}
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
        {cardId && (
          <Modal onClose={onCloseHandler}>
            {lists ? (
              <CardDetail
                listsArray={[...lists]}
                tags={project?.tags || undefined}
                members={members}
                onDelete={deleteCardHandler}
                onClose={onCloseHandler}
              />
            ) : (
              <div></div>
            )}
          </Modal>
        )}
        <Container>
          <ProjectSidebar title={project?.title} isShow={isShowSidebar} />
          <ShowSidebarButton
            isShowSidebar={isShowSidebar}
            onClick={() => {
              setIsShowSidebar((prev) => !prev);
            }}
          >
            {isShowSidebar ? "<" : ">"}
          </ShowSidebarButton>
          <BorderWrapper isShowSidebar={isShowSidebar}>
            <SubNavbar isShowSidebar={isShowSidebar}>
              <TitleWrapper>{project && project.title}</TitleWrapper>
              <CardFilter keyword={keyword} setKeyword={setKeyword} />
              <OnlineMembers memberIDs={memberIDs} />
            </SubNavbar>
            <DragDropContext
              onDragEnd={onDragEndHandler}
              onDragStart={isDraggingHandler}
            >
              {isExist && projectBoard()}
              {isExist === false && <div>Project is not exist.</div>}
            </DragDropContext>
          </BorderWrapper>
        </Container>
      </>
    </PrivateRoute>
  );
};

export default Project;
