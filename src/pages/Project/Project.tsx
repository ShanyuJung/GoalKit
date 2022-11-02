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
import NewElement from "./components/NewElement";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  border: 1px #000 solid;
  display: flex;
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
      const newList = produce(list, (draftState) => {
        const [newOrder] = draftState.splice(source.index, 1);
        draftState.splice(destination.index, 0, newOrder);
      });
      updateDataHandler(newList);
      // setList(newList);
    }

    if (result.type === "LIST") {
      const newList = produce(list, (draftState) => {
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
      updateDataHandler(newList);
      // setList(newList);
    }
  };

  const newCardHandler = (newCardTitle: string) => {
    console.log(newCardTitle);
  };

  const newListHandler = (newListTitle: string) => {
    console.log(newListTitle);
  };

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
              <NewElement
                onSubmit={newListHandler}
                placeholder="&#43; Add new list"
                buttonText="Add new list"
              />
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
