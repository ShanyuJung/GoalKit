import styled from "styled-components";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import NewCard from "./NewCard";

const Container = styled.div`
  border-radius: 10px;
  margin: 0px 5px;
  background-color: #ebecf0;
  padding: 10px 3px 10px 10px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
`;

const Wrapper = styled.div`
  max-height: calc(100vh - 150px);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-button {
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #ccc;
  }

  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`;

const Title = styled.div`
  margin: 0px 15px;
  font-weight: 900;
  font-size: 16px;
`;

interface Props {
  title: string;
  cards: { title: string; id: string }[];
  id: string;
  tags?: { id: string; colorCode: string; title: string }[];
  newCardHandler: (newCardTitle: string, parentID: string) => void;
}

const List = ({ title, cards, id, newCardHandler, tags }: Props) => {
  return (
    <Droppable droppableId={id} type="LIST">
      {(provided) => (
        <Container {...provided.droppableProps} ref={provided.innerRef}>
          <Title>{title}</Title>
          <Wrapper>
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
                      <Card key={card.id} cardInfo={card} tags={tags} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            <NewCard onSubmit={newCardHandler} parentID={id} />
          </Wrapper>
        </Container>
      )}
    </Droppable>
  );
};

export default List;
