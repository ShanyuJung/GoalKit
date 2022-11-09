import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import List from "./components/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import produce from "immer";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import NewList from "./components/NewList";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import CardDetail from "./components/CardDetail";
import ProjectSidebar from "./components/ProjectSidebar";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const BorderWrapper = styled.div`
  height: calc(100vh - 50px);
  flex-grow: 1;
  overflow-x: scroll;
`;

const SubNavbar = styled.div`
  height: 40px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  background-color: #fff;
  z-index: 9;
`;

const TitleWrapper = styled.div`
  font-size: 20px;
  font-weight: bolder;
`;

const Wrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const ListWrapper = styled.div`
  padding: 0px 20px;
  display: flex;
  width: fit-content;
  overflow-x: scroll;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
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
}

interface Workspace {
  id: string;
  owner: string;
  title: string;
  projects: { id: string; title: string }[];
  members: string[];
}

const Project = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [project, setProject] = useState<ProjectInterface | undefined>(
    undefined
  );
  const [members, setMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id, cardId } = useParams();

  const updateDataHandler = async (newList: ListInterface[]) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, { lists: newList });
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const onDragEndHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (result.type === "BOARD") {
      const newLists = produce(lists, (draftState) => {
        const [newOrder] = draftState.splice(source.index, 1);
        draftState.splice(destination.index, 0, newOrder);
      });
      updateDataHandler(newLists);
      // setList(newList);
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
      updateDataHandler(newLists);
      // setList(newList);
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
      setMembers(curWorkspaces[0].members);
    };

    getMembersHandler();
  }, [project]);

  console.log(members);

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
                listsArray={lists}
                tags={project?.tags || undefined}
                members={members}
              />
            ) : (
              <div></div>
            )}
          </Modal>
        )}
        <Container>
          <ProjectSidebar title={project?.title} />
          <BorderWrapper>
            <SubNavbar>
              <TitleWrapper>{project && project.title}</TitleWrapper>
            </SubNavbar>
            <DragDropContext onDragEnd={onDragEndHandler}>
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
