import { useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import produce from "immer";
import styled from "styled-components";
import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ReactComponent as cardIcon } from "../../../../assets/details-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../../../assets/close-svgrepo-com.svg";
import Description from "./Description";
import Time from "./Time";
import Tags from "./Tags";
import Owners from "./Owners";
import CardDetailSideBar from "./CardDetailSidebar";
import Todo from "./Todo";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import {
  CardInterface,
  ListInterface,
  MemberInterface,
} from "../../../../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-right: 10px;
  max-width: 400px;

  @media (max-width: 920px) {
    min-height: auto;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  height: 36px;
  width: 100%;
`;

const CardLogo = styled(cardIcon)`
  width: 36px;
  height: 36px;
  flex-shrink: 0;

  path {
    fill: #828282;
  }
`;

const ContainerWrapper = styled.div`
  display: flex;

  @media (max-width: 808px) {
    overflow-x: auto;
  }
`;

const TitleInput = styled.input`
  margin: 10px;
  font-size: 24px;
  font-weight: 900;
  border: none;
  flex-grow: 1;
  box-sizing: border-box;
  background-color: transparent;

  &:focus {
    background-color: #fff;
  }
`;

const ErrorText = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
`;

const CloseButton = styled(closeIcon)`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;

  path {
    fill: #999;
  }

  &:hover {
    path {
      fill: #333;
    }
  }
`;

interface Props {
  listsArray: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  members?: MemberInterface[];
  onDelete: (targetCardID: string) => void;
  onClose: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  draggingLists?: { listID: string; displayName: string }[] | undefined;
  draggingCards?: { cardID: string; displayName: string }[] | undefined;
}

const initialState = {
  title: "",
  id: "",
};

interface InitialState {
  type: "INITIAL_STATE";
  payload: CardInterface;
}

interface TitlePayloadAction {
  type: "UPDATE_TITLE";
  payload: {
    title: string;
  };
}

interface DescriptionPayloadAction {
  type: "UPDATE_DESCRIPTION";
  payload: {
    description: string;
  };
}

interface TimePayloadAction {
  type: "UPDATE_TIME";
  payload: {
    time: { start?: number; deadline?: number };
  };
}

interface TagPayloadAction {
  type: "UPDATE_TAG";
  payload: {
    tagsIDs: string[];
  };
}

interface OwnerPayloadAction {
  type: "UPDATE_OWNER";
  payload: {
    owner: string[];
  };
}

interface CompletePayloadAction {
  type: "UPDATE_COMPLETE";
  payload: {
    complete: boolean;
  };
}

interface TodoPayloadAction {
  type: "UPDATE_TODO";
  payload: {
    todo: { title: string; isDone: boolean; id: string }[];
  };
}

type Action =
  | TitlePayloadAction
  | TimePayloadAction
  | InitialState
  | DescriptionPayloadAction
  | TagPayloadAction
  | OwnerPayloadAction
  | CompletePayloadAction
  | TodoPayloadAction;

const CardDetail: React.FC<Props> = ({
  listsArray,
  tags,
  members,
  onDelete,
  onClose,
  draggingCards,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [ownerInfo, setOwnerInfo] = useState<MemberInterface[]>([]);
  const [isEditDate, setIsEditDate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const { projectID, cardID } = useParams();

  const updateDataHandler = async (newList: ListInterface[]) => {
    if (!projectID || isLoading || !isExist) return;
    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", projectID);
      await updateDoc(projectRef, { lists: newList });
    } catch (e) {
      Swal.fire(
        "Failed to update card!",
        "Please check your internet connection and try again later",
        "warning"
      );
    }
    setIsLoading(false);
  };

  const newListHandler = (newCard: CardInterface) => {
    const newLists = produce(listsArray, (draftState) => {
      const listIndex = draftState.findIndex((list) => {
        return list.cards.some((card) => {
          return card.id === cardID;
        });
      });
      const cardIndex = draftState[listIndex].cards.findIndex((card) => {
        return card.id === cardID;
      });
      if (listIndex === -1 || cardIndex == -1 || !newCard) return draftState;
      draftState[listIndex].cards[cardIndex] = newCard;
    });
    return newLists;
  };

  const cardDetailReducer = (state: CardInterface, action: Action) => {
    switch (action.type) {
      case "INITIAL_STATE":
        return {
          ...state,
          ...action.payload,
        };
      case "UPDATE_TITLE":
        return {
          ...state,
          title: action.payload.title,
        };
      case "UPDATE_DESCRIPTION":
        return {
          ...state,
          description: action.payload.description,
        };
      case "UPDATE_TIME":
        return {
          ...state,
          time: action.payload.time,
        };
      case "UPDATE_TAG":
        return {
          ...state,
          tagsIDs: action.payload.tagsIDs,
        };
      case "UPDATE_OWNER":
        return {
          ...state,
          owner: action.payload.owner,
        };
      case "UPDATE_COMPLETE":
        return {
          ...state,
          complete: action.payload.complete,
        };
      case "UPDATE_TODO":
        return {
          ...state,
          todo: action.payload.todo,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(cardDetailReducer, initialState);

  const updateTitleHandler = () => {
    if (!isExist) return;
    if (!titleRef.current?.value.trim()) {
      alert("Empty title is not allowed!");
      Swal.fire(
        "Empty title is not allowed!",
        "Please type something",
        "warning"
      );

      return;
    }
    if (titleRef.current?.value.trim() === state.title) {
      return;
    }
    const newTitle = titleRef.current.value.trim();
    dispatch({ type: "UPDATE_TITLE", payload: { title: newTitle } });
  };

  const updateDescriptionHandler = (text: string) => {
    if (!isExist) return;
    dispatch({
      type: "UPDATE_DESCRIPTION",
      payload: { description: text },
    });
  };

  const updateTimeHandler = (curStart: number, curDeadline: number) => {
    if (!isExist) return;
    const newTime = { start: curStart, deadline: curDeadline };
    dispatch({ type: "UPDATE_TIME", payload: { time: newTime } });
  };

  const selectTagHandler = (newTags: string[]) => {
    if (!isExist) return;
    dispatch({ type: "UPDATE_TAG", payload: { tagsIDs: newTags } });
  };

  const addOwnerHandler = (ownerID: string) => {
    if (!isExist) return;
    const isOwnerExist = state.owner?.includes(ownerID);
    if (isOwnerExist) return;
    const curOwners: string[] = state.owner || [];
    const newOwners = produce(curOwners, (draftState) => {
      draftState.push(ownerID);
    });
    dispatch({ type: "UPDATE_OWNER", payload: { owner: newOwners } });
  };

  const removeOwnerHandler = (ownerID: string) => {
    if (!isExist) return;
    const isOwnerExist = state.owner?.includes(ownerID);
    if (!isOwnerExist) return;
    const curOwners: string[] = state.owner || [];
    const newOwners = produce(curOwners, (draftState) => {
      const index = draftState.findIndex((id) => id === ownerID);
      draftState.splice(index, 1);
    });

    dispatch({ type: "UPDATE_OWNER", payload: { owner: newOwners } });
  };

  const completeTaskHandler = (isChecked: boolean) => {
    if (!isExist) return;
    dispatch({ type: "UPDATE_COMPLETE", payload: { complete: isChecked } });
  };

  const addNewTodoHandler = (titleText: string) => {
    if (!isExist) return;
    const newId = uuidv4();
    const curTodo: { title: string; isDone: boolean; id: string }[] =
      state.todo || [];
    const newTodo = produce(curTodo, (draftState) => {
      draftState.push({ title: titleText, isDone: false, id: newId });
    });

    dispatch({ type: "UPDATE_TODO", payload: { todo: newTodo } });

    if (!state.time || !state.time.start || !state.time.deadline) {
      const curTime = new Date().getTime();
      const newTime = { start: curTime, deadline: curTime + 86400000 };
      dispatch({ type: "UPDATE_TIME", payload: { time: newTime } });
    }
  };

  const deleteTodoHandler = (todoID: string) => {
    if (!isExist) return;
    if (state.todo && state.todo.length > 0) {
      const todoIndex = state.todo.findIndex((item) => item.id === todoID);
      const cutTodo = [...state.todo];
      const newTodo = produce(cutTodo, (draftState) => {
        draftState.splice(todoIndex, 1);
      });

      dispatch({ type: "UPDATE_TODO", payload: { todo: newTodo } });
    }
  };

  const completeTodoHandler = (isChecked: boolean, id: string) => {
    if (!isExist) return;
    const newTodo =
      state.todo?.map((item) => {
        if (item.id === id) {
          return { ...item, isDone: isChecked };
        } else {
          return { ...item };
        }
      }) || [];

    dispatch({ type: "UPDATE_TODO", payload: { todo: newTodo } });
  };

  const deleteCardHandler = (targetCardID: string) => {
    const checkIsDraggingHandler = () => {
      if (!draggingCards) return false;

      const draggingCardsID = draggingCards?.map((cards) => cards.cardID);
      if (draggingCardsID.includes(targetCardID)) {
        Swal.fire(
          "Warning!",
          "Selected card is dragging by other user, deleting failed.",
          "warning"
        );
        return true;
      }

      return false;
    };

    const isDeleteValid = checkIsDraggingHandler();
    if (isDeleteValid) return;

    setIsDelete(true);
    onDelete(targetCardID);
    Swal.fire("Deleted!", "Selected card has been deleted.", "success");
  };

  useEffect(() => {
    const curCardHandler = () => {
      if (!cardID || listsArray.length === 0) return;
      const [newList] = listsArray.filter((list) => {
        return list.cards.some((card) => {
          return card.id === cardID;
        });
      });
      if (!newList) {
        setIsExist(false);
        return;
      }
      setIsExist(true);
      const [newCard] = newList.cards.filter((card) => {
        return card.id === cardID;
      });
      dispatch({ type: "INITIAL_STATE", payload: newCard });
    };

    curCardHandler();
  }, [listsArray, cardID]);

  useEffect(() => {
    const setOwnerInfoHandler = () => {
      if (!state.owner || !members) return;

      const emptyArr: MemberInterface[] = [];
      const newOwnerInfo = produce(emptyArr, (draftState) => {
        members.forEach((member) => {
          if (state.owner?.includes(member.uid)) {
            draftState.push(member);
          }
        });
      });
      setOwnerInfo([...newOwnerInfo]);
    };

    setOwnerInfoHandler();
  }, [state.owner, members]);

  useEffect(() => {
    if (state.id === "" || isExist === false || isDelete) return;
    const newLists = newListHandler(state);
    updateDataHandler(newLists);
  }, [state]);

  const renderCardInfo = () => {
    if (state.id === "") return null;

    return (
      <Wrapper>
        <Description
          onSubmit={updateDescriptionHandler}
          text={state.description || ""}
        />
        <Time
          curStart={state.time?.start}
          curDeadline={state.time?.deadline}
          isComplete={state.complete || false}
          onSubmit={updateTimeHandler}
          onCheck={completeTaskHandler}
          todo={state.todo || []}
          isEdit={isEditDate}
          setIsEdit={setIsEditDate}
        />
        <Todo
          todo={state.todo || []}
          onCheck={completeTodoHandler}
          onDelete={deleteTodoHandler}
        />
        <Tags tagsIDs={state.tagsIDs} tags={tags} />
        <Owners
          ownerInfo={ownerInfo || []}
          removeOwnerHandler={removeOwnerHandler}
        />
      </Wrapper>
    );
  };

  if (isExist === false) {
    return (
      <Container>
        <ErrorText>Card is deleted or not exist.</ErrorText>
        <CloseButton
          onClick={() => {
            onClose(false);
          }}
        />
      </Container>
    );
  }

  return (
    <Container>
      <CloseButton
        onClick={() => {
          onClose(false);
        }}
      />
      <TitleWrapper>
        <CardLogo />
        <TitleInput
          type="text"
          ref={titleRef}
          defaultValue={state.title}
          onBlur={updateTitleHandler}
        />
      </TitleWrapper>
      <ContainerWrapper>
        {renderCardInfo()}
        <CardDetailSideBar
          onDelete={deleteCardHandler}
          todoHandler={addNewTodoHandler}
          setIsEditDate={setIsEditDate}
          members={members || []}
          addOwnerHandler={addOwnerHandler}
          tagsIDs={state.tagsIDs}
          tags={tags}
          onChange={selectTagHandler}
          listsArray={listsArray}
        />
      </ContainerWrapper>
    </Container>
  );
};

export default CardDetail;
