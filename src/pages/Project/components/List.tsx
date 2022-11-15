import styled from "styled-components";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import NewCard from "./NewCard";
import { ReactComponent as MoreIcon } from "../../../assets/more-svgrepo-com.svg";
import { ReactComponent as TrashIcon } from "../../../assets/trash-svgrepo-com.svg";
import { useState } from "react";

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

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const Title = styled.div`
  margin: 0px 15px;
  font-weight: 900;
  font-size: 20px;
`;

const MoreLogo = styled(MoreIcon)`
  height: 18px;
  width: 48px;
  margin: 5px 0px;
  cursor: pointer;

  circle {
    fill: #929292;
  }

  &:hover {
    circle {
      fill: #828282;
    }
  }
`;

const ModalWrapper = styled.div`
  height: 0px;
`;

const MoreModal = styled.div<{ isShow: boolean }>`
  display: ${(props) => (props.isShow ? "block" : "none")};
  background-color: #ddd;
  position: relative;
  width: 100px;
  top: 0px;
  right: -145px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
`;

const ModalList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ModalListItem = styled.div`
  padding: 5px;
  width: 100%;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #ccc;
  }
`;

const TrashLogo = styled(TrashIcon)`
  height: 16px;
  margin-right: 5px;

  path {
    fill: #777;
  }
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
  deleteList: (targetListID: string) => void;
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
  deleteList,
}: Props) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const checkDeleteListHandler = () => {
    const r = window.confirm("Check to delete selected list");
    if (r === true) {
      deleteList(id);
    } else {
      setIsShowModal(false);
    }
  };

  return (
    <Droppable droppableId={id} type="LIST">
      {(provided) => (
        <Container
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDragging={draggingLists?.includes(id) || false}
        >
          <TitleWrapper>
            <Title>{title}</Title>
            <MoreLogo
              onClick={() => {
                setIsShowModal((prev) => !prev);
              }}
            />
          </TitleWrapper>
          <ModalWrapper>
            <MoreModal isShow={isShowModal}>
              <ModalList>
                <ModalListItem onClick={checkDeleteListHandler}>
                  <TrashLogo />
                  Delete list
                </ModalListItem>
              </ModalList>
            </MoreModal>
          </ModalWrapper>
          <Wrapper>
            {cards.map((card, index) => {
              return (
                <Draggable
                  key={`draggable-card-${card.id}`}
                  draggableId={card.id}
                  index={index}
                  isDragDisabled={draggingCards?.includes(card.id) || false}
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
