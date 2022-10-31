import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import List from "./components/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  border: 1px #000 solid;
  display: flex;
`;

const LISTS = [
  {
    title: "List1",
    id: "listQWE",
    cards: [
      { title: "card1", id: "cardQWE" },
      { title: "card2", id: "card123456" },
    ],
  },
  {
    title: "List2",
    id: "listASD",
    cards: [
      { title: "card1", id: "cardASD" },
      { title: "card2", id: "card23461" },
    ],
  },
  {
    title: "List3",
    id: "list3re762r",
    cards: [{ title: "card1", id: "card2463417" }],
  },
];

const Project = () => {
  const [list, setList] = useState(LISTS);

  const onDragEnHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newList = Array.from(list);
    const [newOrder] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, newOrder);

    setList(newList);
  };

  return (
    <PrivateRoute>
      <DragDropContext onDragEnd={onDragEnHandler}>
        <Droppable droppableId="Project1" direction="horizontal">
          {(provided) => (
            <Wrapper {...provided.droppableProps} ref={provided.innerRef}>
              Project1
              <ListWrapper>
                {list.map((list, index) => {
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
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ListWrapper>
            </Wrapper>
          )}
        </Droppable>
      </DragDropContext>
    </PrivateRoute>
  );
};

export default Project;
