import styled from "styled-components";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import NewCard from "./NewCard";

interface IsDraggingProps {
  isDragging: boolean;
}

const Container = styled.div<IsDraggingProps>`
  border-radius: 10px;
  margin: 0px 5px;
  background-color: #ebecf0;
  padding: 10px 3px 10px 10px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
  outline: ${(props) => (props.isDragging ? "2px solid blue" : "none")};
`;

const Wrapper = styled.div`
  /* max-height: calc(100vh - 150px);
  overflow-y: scroll; */

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

const NewCardWrapper = styled.div`
  margin: 10px;
  width: 230px;
`;

interface Member {
  uid: string;
  email: string;
  displayName: string;
}

interface Props {
  title: string;
  cards: { title: string; id: string }[];
  id: string;
  tags?: { id: string; colorCode: string; title: string }[];
  newCardHandler: (newCardTitle: string, parentID: string) => void;
  members: Member[];
  draggingLists: string[] | undefined;
  draggingCards: string[] | undefined;
}

const List = ({
  title,
  cards,
  id,
  newCardHandler,
  tags,
  members,
  draggingLists,
  draggingCards,
}: Props) => {
  return (
    <Droppable droppableId={id} type="LIST">
      {(provided) => (
        <Container
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDragging={draggingLists?.includes(id) || false}
        >
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
                      <Card
                        key={card.id}
                        cardInfo={card}
                        tags={tags}
                        members={members}
                        draggingCards={draggingCards}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            <NewCardWrapper>
              <NewCard onSubmit={newCardHandler} parentID={id} />
            </NewCardWrapper>
          </Wrapper>
        </Container>
      )}
    </Droppable>
  );
};

export default List;
