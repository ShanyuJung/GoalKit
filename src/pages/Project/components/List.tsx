import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../../utils/hooks";
import Card from "./Card";
import NewCard from "./NewCard";
import DropdownButton from "../../../components/button/DropdownButton";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ReactComponent as moreIcon } from "../../../assets/more-svgrepo-com.svg";
import { ReactComponent as trashIcon } from "../../../assets/trash-svgrepo-com.svg";
import { ReactComponent as moveIcon } from "../../../assets/move-arrows-svgrepo-com.svg";
import { CardInterface, ListInterface, MemberInterface } from "../../../types";

interface IsDraggingProps {
  $isDragging: boolean;
  $draggingUser: string;
}

const Container = styled.div<IsDraggingProps>`
  position: relative;
  border-radius: 10px;
  margin: 0px 5px;
  background-color: #ebecf0;
  padding: 10px 10px 10px 10px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.35);
  outline: ${(props) => (props.$isDragging ? "2px solid blue" : "none")};
  width: 290px;

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
  /* max-height: calc(100vh - 180px); */
  /* overflow-y: auto; */
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
  margin: 0px 0px 0px 15px;
  font-weight: 900;
  font-size: 20px;
  overflow: hidden;
  word-break: break-all;
  white-space: wrap;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 30px;
  width: 48px;
`;

const MoreIcon = styled(moreIcon)`
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
  width: 150px;
  padding: 5px;
  top: -5px;
  right: 107px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.35);
  z-index: 20;
`;

const ModalList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ModalListItem = styled.div`
  padding: 5px 10px;
  width: 100%;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

const TrashIcon = styled(trashIcon)`
  height: 16px;
  width: 16px;
  margin-right: 5px;

  path {
    fill: #777;
  }
`;

const NewCardWrapper = styled.div`
  margin: 10px;
  width: 230px;
`;

const MoveIcon = styled(moveIcon)`
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

const MoveAllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ccc;
`;

const MoveAllTitle = styled.div`
  font-size: 12px;
  text-align: center;
  width: 90%;
  font-weight: 600;
  padding-top: 5px;
  border-bottom: 1px solid #777;
  margin: auto;
`;

const MoveAllButton = styled.button`
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border: none;
  text-align: left;
  background-color: #ccc;
  cursor: pointer;

  &:hover {
    background-color: #999;
  }
`;

interface Props {
  title: string;
  cards: { title: string; id: string }[];
  id: string;
  tags?: { id: string; colorCode: string; title: string }[];
  newCardHandler: (newCardTitle: string, parentID: string) => void;
  members: MemberInterface[];
  draggingLists: { listID: string; displayName: string }[] | undefined;
  draggingCards: { cardID: string; displayName: string }[] | undefined;
  deleteList: (targetListID: string) => void;
  lists: ListInterface[];
  moveAllCardsHandler: (curListID: string, targetListID: string) => void;
  isFilter: boolean;
  keyword: string;
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
  lists,
  moveAllCardsHandler,
  isFilter,
  keyword,
}: Props) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [draggingUser, setDraggingUser] = useState<string>("");
  const [displayCards, setDisplayCards] = useState<CardInterface[]>([]);
  const ref = useRef(null);

  useEffect(() => {
    if (isFilter) {
      const newCards = cards.filter((card) => {
        try {
          return card.title.toLowerCase().match(keyword.toLowerCase());
        } catch (e) {
          console.log(e);
        }
      });

      setDisplayCards(newCards);
      return;
    }

    setDisplayCards(cards);
  }, [cards, isFilter, keyword]);

  const checkDeleteListHandler = () => {
    Swal.fire({
      title: "Confirm to delete selected list",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#658da6b4",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e74d3ce3",
    }).then((result) => {
      if (result.value === true) {
        const checkIsDraggingHandler = () => {
          if (!draggingLists && !draggingCards) return false;

          const draggingListsID = draggingLists?.map((list) => list.listID);
          if (draggingListsID && draggingListsID.includes(id)) {
            Swal.fire(
              "Warning!",
              "Selected list is dragging by other user, deleting failed.",
              "warning"
            );
            return true;
          }

          const draggingCardsID = draggingCards?.map((cards) => cards.cardID);
          const cardsID = displayCards.map((card) => card.id);
          if (!draggingCardsID) return false;

          const isChildDragging = cardsID.some(
            (r) => draggingCardsID.indexOf(r) >= 0
          );
          if (isChildDragging) {
            Swal.fire(
              "Warning!",
              "Child of selected list is dragging by other user, deleting failed.",
              "warning"
            );

            return true;
          }
          return false;
        };

        const isDeleteValid = checkIsDraggingHandler();
        if (isDeleteValid) return;
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

  const listGroup = () => {
    return (
      <MoveAllWrapper>
        <MoveAllTitle>Move cards to :</MoveAllTitle>
        {lists.map((list) => {
          if (id !== list.id) {
            return (
              <MoveAllButton
                key={`move-all-${list.id}`}
                onClick={() => {
                  moveAllCardsHandler(id, list.id);
                  setIsShowModal(false);
                }}
              >
                {list.title}
              </MoveAllButton>
            );
          }
        })}
      </MoveAllWrapper>
    );
  };

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
              <MoreIcon
                onClick={() => {
                  setIsShowModal((prevIsShowModal) => !prevIsShowModal);
                }}
              />
              <ModalWrapper>
                <MoreModal isShow={isShowModal}>
                  <ModalList>
                    <ModalListItem onClick={checkDeleteListHandler}>
                      <TrashIcon />
                      Delete list
                    </ModalListItem>
                    <DropdownButton
                      logo={<MoveIcon />}
                      text={"Move all cards"}
                      fontSize={12}
                      isDisabled={cards.length > 0 ? false : true}
                    >
                      {listGroup()}
                    </DropdownButton>
                  </ModalList>
                </MoreModal>
              </ModalWrapper>
            </LogoWrapper>
          </TitleWrapper>
          <Wrapper>
            {displayCards.map((card, index) => {
              return (
                <Draggable
                  key={`draggable-card-${card.id}`}
                  draggableId={card.id}
                  index={index}
                  isDragDisabled={
                    isFilter ||
                    draggingCards?.some(
                      (draggingCard) => draggingCard.cardID === card.id
                    ) ||
                    false
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
