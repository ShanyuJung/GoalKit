import { useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import produce from "immer";
import styled from "styled-components";
import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ReactComponent as cardIcon } from "../../../../assets/details-svgrepo-com.svg";
import Description from "./Description";
import Time from "./Time";
import Tags from "./Tags";
import Owners from "./Owners";
import CardDetailSideBar from "./CardDetailSidebar";
import Todo from "./Todo";
import { v4 as uuidv4 } from "uuid";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Wrapper = styled.div`
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  width: 410px;
  padding-right: 10px;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  height: 36px;
  width: 100%;
`;

const CardLogo = styled(cardIcon)`
  path {
    fill: #828282;
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

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface Member {
  uid: string;
  email: string;
  displayName: string;
}

interface Props {
  listsArray: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  members?: Member[];
  onDelete: (targetCardID: string) => void;
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
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<Member[]>([]);
  const [isEditDate, setIsEditDate] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const { id, cardId } = useParams();

  const updateDataHandler = async (newList: ListInterface[]) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, { lists: newList });
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const newListHandler = (newCard: CardInterface) => {
    const newLists = produce(listsArray, (draftState) => {
      const listIndex = draftState.findIndex((list) => {
        return list.cards.some((card) => {
          return card.id === cardId;
        });
      });
      const cardIndex = draftState[listIndex].cards.findIndex((card) => {
        return card.id === cardId;
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
    if (!titleRef.current?.value.trim()) {
      alert("Empty title is not allowed!");
      return;
    }
    if (titleRef.current?.value.trim() === state.title) {
      return;
    }
    const newTitle = titleRef.current.value.trim();
    dispatch({ type: "UPDATE_TITLE", payload: { title: newTitle } });
  };

  const updateDescriptionHandler = (text: string) => {
    dispatch({
      type: "UPDATE_DESCRIPTION",
      payload: { description: text },
    });
  };

  const updateTimeHandler = (curStart: number, curDeadline: number) => {
    const newTime = { start: curStart, deadline: curDeadline };
    dispatch({ type: "UPDATE_TIME", payload: { time: newTime } });
  };

  const selectTagHandler = (newTags: string[]) => {
    dispatch({ type: "UPDATE_TAG", payload: { tagsIDs: newTags } });
  };

  const addOwnerHandler = (ownerID: string) => {
    const isOwnerExist = state.owner?.includes(ownerID);
    if (isOwnerExist) return;
    const curOwners: string[] = state.owner || [];
    const newOwners = produce(curOwners, (draftState) => {
      draftState.push(ownerID);
    });
    dispatch({ type: "UPDATE_OWNER", payload: { owner: newOwners } });
  };

  const removeOwnerHandler = (ownerID: string) => {
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
    dispatch({ type: "UPDATE_COMPLETE", payload: { complete: isChecked } });
  };

  const addNewTodoHandler = (titleText: string) => {
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

  useEffect(() => {
    const curCardHandler = () => {
      if (!cardId || listsArray.length === 0) return;
      const [newList] = listsArray.filter((list) => {
        return list.cards.some((card) => {
          return card.id === cardId;
        });
      });
      const [newCard] = newList.cards.filter((card) => {
        return card.id === cardId;
      });
      dispatch({ type: "INITIAL_STATE", payload: newCard });
    };

    curCardHandler();
  }, [listsArray, cardId]);

  useEffect(() => {
    const setOwnerInfoHandler = () => {
      if (!state.owner || !members) return;

      const emptyArr: Member[] = [];
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
    if (state.id === "") return;
    const newLists = newListHandler(state);
    updateDataHandler(newLists);
  }, [state]);

  const cardInfo = () => {
    if (state.id === "") return;

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
        <Tags tagsIDs={state.tagsIDs} tags={tags} onChange={selectTagHandler} />
        <Owners
          ownerInfo={ownerInfo || []}
          removeOwnerHandler={removeOwnerHandler}
        />
      </Wrapper>
    );
  };

  return (
    <Container>
      <TitleWrapper>
        <CardLogo />
        <TitleInput
          type="text"
          ref={titleRef}
          defaultValue={state.title}
          onBlur={updateTitleHandler}
        />
      </TitleWrapper>
      <>{cardInfo()}</>
      <CardDetailSideBar
        onDelete={onDelete}
        todoHandler={addNewTodoHandler}
        setIsEditData={setIsEditDate}
        members={members || []}
        addOwnerHandler={addOwnerHandler}
        tagsIDs={state.tagsIDs}
        tags={tags}
        onChange={selectTagHandler}
      />
    </Container>
  );
};

export default CardDetail;
