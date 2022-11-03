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
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NewList from "./components/NewList";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import CardDetail from "./components/CardDetail";

const Wrapper = styled.div`
  width: 100%;
`;

const TitleWrapper = styled.div``;

const ListWrapper = styled.div`
  padding: 20px;
  border: 1px #000 solid;
  display: flex;
  width: 100%;
  overflow-x: scroll;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string;
  tags?: string[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

const Project = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [title, setTitle] = useState("");
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
    if (!id) return;
    const projectRef = doc(db, "projects", id);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        setTitle(snapshot.data()?.title);
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
            <TitleWrapper>{title}</TitleWrapper>
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
            {lists ? <CardDetail listsArray={lists} /> : <div></div>}
          </Modal>
        )}
        <DragDropContext onDragEnd={onDragEndHandler}>
          {isExist && projectBoard()}
          {isExist === false && <div>Project is not exist.</div>}
        </DragDropContext>
      </>
    </PrivateRoute>
  );
};

export default Project;
