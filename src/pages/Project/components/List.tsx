import styled from "styled-components";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import NewCard from "./NewCard";
import { ReactComponent as moreIcon } from "../../../assets/more-svgrepo-com.svg";
import { ReactComponent as trashIcon } from "../../../assets/trash-svgrepo-com.svg";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../../utils/hooks";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";

interface IsDraggingProps {
  $isDragging: boolean;
  $draggingUser: string;
}

const Container = styled.div<IsDraggingProps>`
  position: relative;
  border-radius: 10px;
  margin: 0px 5px;
  background-color: #ebecf0;
  padding: 10px 3px 10px 10px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
  outline: ${(props) => (props.$isDragging ? "2px solid blue" : "none")};
  min-width: 283px;

  &::before {
    content: ${(props) =>
      props.$draggingUser ? `"${props.$draggingUser}"` : ""};
    position: absolute;
    z-index: 2;
    background-color: #3498db;
    padding: 0px 5px;
    border-radius: 5px;
    bottom: -10px;
    right: 10px;
  }
`;

const Wrapper = styled.div`
  /* max-height: calc(100vh - 150px);
  overflow-y: scroll; */
  position: relative;
  z-index: 5;

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

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 30px;
  width: 48px;
`;

const MoreLogo = styled(moreIcon)`
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
  width: 110px;
  padding: 5px;
  top: -5px;
  right: 67px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
  z-index: 5;
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

const TrashLogo = styled(trashIcon)`
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
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

interface Props {
  title: string;
  cards: { title: string; id: string }[];
  id: string;
  tags?: { id: string; colorCode: string; title: string }[];
  newCardHandler: (newCardTitle: string, parentID: string) => void;
  members: Member[];
  draggingLists: { listID: string; displayName: string }[] | undefined;
  draggingCards: { cardID: string; displayName: string }[] | undefined;
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
  const [draggingUser, setDraggingUser] = useState("");
  const ref = useRef(null);

  const checkDeleteListHandler = () => {
    Swal.fire({
      title: "Confirm to delete selected list",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value === true) {
        deleteList(id);
        Swal.fire("Deleted!", "Selected list has been deleted.", "success");
      }
    });
  };

  useOnClickOutside(ref, () => setIsShowModal(false));

  useEffect(() => {
    const draggingInfo = draggingLists?.find(
      (draggingList) => draggingList.listID === id
    );
    if (!draggingInfo) {
      setDraggingUser("");
      return;
    }
    setDraggingUser(draggingInfo.displayName);
  }, [draggingLists]);

  return (
    <Droppable droppableId={id} type="LIST">
      {(provided) => (
        <Container
          {...provided.droppableProps}
          ref={provided.innerRef}
          $isDragging={
            draggingLists?.some((draggingList) => draggingList.listID === id) ||
            false
          }
          $draggingUser={draggingUser}
        >
          <TitleWrapper>
            <Title>{title}</Title>
            <LogoWrapper ref={ref}>
              <MoreLogo
                onClick={() => {
                  setIsShowModal((prev) => !prev);
                }}
              />
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
            </LogoWrapper>
          </TitleWrapper>
          <Wrapper>
            {cards.map((card, index) => {
              return (
                <Draggable
                  key={`draggable-card-${card.id}`}
                  draggableId={card.id}
                  index={index}
                  isDragDisabled={
                    draggingCards?.some(
                      (draggingCard) => draggingCard.cardID === card.id
                    ) || false
                  }
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
