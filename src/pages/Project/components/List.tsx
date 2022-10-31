import { useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const Wrapper = styled.div`
  padding: 5px;
  border: 1px black solid;
  margin: 5px;
`;

const Title = styled.div``;

interface Props {
  title: string;
  cards: { title: string; id: string }[];
  id: string;
}

const List = ({ title, cards, id }: Props) => {
  const [displayCards, setDisplayCards] = useState(cards);

  const onDragEndHandler = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newCards = Array.from(displayCards);
    const [newOrder] = newCards.splice(source.index, 1);
    newCards.splice(destination.index, 0, newOrder);

    setDisplayCards(newCards);
  };

  return (
    <Droppable droppableId={id} type="List">
      {(provided) => (
        <Wrapper {...provided.droppableProps} ref={provided.innerRef}>
          <Title>{title}</Title>
          {cards.map((card, index) => {
            return (
              <Draggable
                key={`draggable-card-${card.id}`}
                draggableId={card.id}
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
                    <Card title={card.title} key={card.id} />
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default List;
