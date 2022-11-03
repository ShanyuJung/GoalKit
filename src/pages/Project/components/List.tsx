import styled from "styled-components";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import NewCard from "./NewCard";

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
  newCardHandler: (newCardTitle: string, parentID: string) => void;
}

const List = ({ title, cards, id, newCardHandler }: Props) => {
  return (
    <Droppable droppableId={id} type="LIST">
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
          <NewCard onSubmit={newCardHandler} parentID={id} />
        </Wrapper>
      )}
    </Droppable>
  );
};

export default List;
