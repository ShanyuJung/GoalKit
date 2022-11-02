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

const Wrapper = styled.div`
  width: 100%;
`;

const ListWrapper = styled.div`
  padding: 20px;
  border: 1px #000 solid;
  display: flex;
  width: 100%;
  overflow-x: scroll;
`;

const PROJECT_ID = "UeoSW4gRXB7JkGcUpCrM";

const Project = () => {
  const [list, setList] = useState<
    { id: string; title: string; cards: Array<{ title: string; id: string }> }[]
  >([]);

  const updateDataHandler = async (
    newList: {
      id: string;
      title: string;
      cards: Array<{ title: string; id: string }>;
    }[]
  ) => {
    const projectRef = doc(db, "projects", PROJECT_ID);
    await updateDoc(projectRef, { lists: newList });
  };

  const onDragEndHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (result.type === "BOARD") {
      const newLists = produce(list, (draftState) => {
        const [newOrder] = draftState.splice(source.index, 1);
        draftState.splice(destination.index, 0, newOrder);
      });
      updateDataHandler(newLists);
      // setList(newList);
    }

    if (result.type === "LIST") {
      const newLists = produce(list, (draftState) => {
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
    const newLists = produce(list, (draftState) => {
      const listIndex = list.findIndex((item) => item.id === parentID);
      draftState[listIndex].cards.push(newCard);
    });

    updateDataHandler(newLists);
  };

  const newListHandler = (newListTitle: string) => {
    const newId = uuidv4();
    const newList = { id: newId, title: newListTitle, cards: [] };
    const newLists = produce(list, (draftState) => {
      draftState.push(newList);
    });

    updateDataHandler(newLists);
    console.log(newListTitle, newId);
  };

  console.log(list);

  useEffect(() => {
    const projectRef = doc(db, "projects", PROJECT_ID);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      setList(snapshot.data()?.lists);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const projectBoard = () => {
    return (
      <Droppable droppableId="Project1" direction="horizontal" type="BOARD">
        {(provided) => (
          <Wrapper {...provided.droppableProps} ref={provided.innerRef}>
            Project1
            <ListWrapper>
              {list.length > 0 &&
                list.map((list, index) => {
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
      <DragDropContext onDragEnd={onDragEndHandler}>
        {projectBoard()}
      </DragDropContext>
    </PrivateRoute>
  );
};

export default Project;
