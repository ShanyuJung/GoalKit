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
      { title: "card3", id: "card233331" },
    ],
  },
  {
    title: "List3",
    id: "list3re762r",
    cards: [{ title: "card1", id: "card2463417" }],
  },
  {
    title: "List4",
    id: "list3re762eer",
    cards: [{ title: "card1", id: "card24634ce17" }],
  },
  {
    title: "List5",
    id: "list3re62eer",
    cards: [{ title: "card1", id: "card246e2ce17" }],
  },
];

const Project = () => {
  const [list, setList] = useState(LISTS);

  const onDragEndHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (result.type === "COLUMN") {
      const newList = Array.from(list);
      const [newOrder] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, newOrder);

      setList(newList);
    }

    if (result.type === "LIST") {
      const newList = Array.from(list);
      const prevListIndex = newList.findIndex((item) => {
        return item.id === source.droppableId;
      });
      const newListIndex = newList.findIndex((item) => {
        return item.id === destination.droppableId;
      });

      const [newOrder] = newList[prevListIndex].cards.splice(source.index, 1);
      newList[newListIndex].cards.splice(destination.index, 0, newOrder);
    }
  };

  return (
    <PrivateRoute>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="Project1" direction="horizontal" type="BOARD">
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
                            id={list.id}
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
