import { FormEvent, useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import produce from "immer";
import styled from "styled-components";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as cardIcon } from "../../../assets/details-svgrepo-com.svg";
import Description from "./Description";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  height: 36px;
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
`;

const TextAreaWrapper = styled.div`
  margin: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextAreaLabel = styled.label``;

const TextArea = styled.textarea``;

const TextAreaButton = styled.button``;

const TimeWrapper = styled.div`
  margin: 10px;
`;

const TimeInputWrapper = styled.div`
  margin: 10px;
`;

const TimeInputLabel = styled.label``;

const TimeInput = styled.input``;

const TimeCheckboxWrapper = styled.div`
  margin: 10px;
`;

const TimeCheckbox = styled.input``;

const TimeCheckboxLabel = styled.label``;

const TimeButton = styled.button``;

const TagsContainer = styled.div``;

const TagList = styled.div``;

const TagSelectorList = styled.div``;

const TagWrapper = styled.div``;

const TagCheckbox = styled.input``;

const TagCheckboxLabel = styled.label``;

const NewTagInputForm = styled.form``;

const NewTagInput = styled.input``;

const NewTagButton = styled.button``;

const OwnerContainer = styled.div``;

const OwnerList = styled.div``;

const OwnerWrapper = styled.div``;

const OwnerButtonWrapper = styled.div``;

const OwnerButton = styled.button``;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
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

type Action =
  | TitlePayloadAction
  | TimePayloadAction
  | InitialState
  | DescriptionPayloadAction
  | TagPayloadAction
  | OwnerPayloadAction;

const CardDetail: React.FC<Props> = ({ listsArray, tags, members }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<Member[]>([]);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const deadlineRef = useRef<HTMLInputElement | null>(null);
  const newTagRef = useRef<HTMLInputElement | null>(null);
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
    console.log(text);

    // if (
    //   !descriptionRef.current?.value.trim() ||
    //   descriptionRef.current?.value.trim() === state?.description
    // ) {
    //   return;
    // }
    // const newDescription = descriptionRef.current.value.trim();
    dispatch({
      type: "UPDATE_DESCRIPTION",
      payload: { description: text },
    });
  };

  const updateTimeHandler = (event: FormEvent) => {
    event.preventDefault();
    const time = startTimeRef.current?.value;
    const deadline = deadlineRef.current?.value;
    const obj: { start?: number; deadline?: number } = {};
    const newTime = produce(obj, (draftState) => {
      if (time) {
        const newTime = new Date(`${time}:00Z`).getTime();
        draftState.start = newTime;
      }
      if (deadline) {
        const newTime = new Date(`${deadline}:00Z`).getTime();
        draftState.deadline = newTime;
      }
    });
    dispatch({ type: "UPDATE_TIME", payload: { time: newTime } });
  };

  const createTagHandler = async (newTag: {
    id: string;
    colorCode: string;
    title: string;
  }) => {
    if (!id || isLoading) return;
    try {
      setIsLoading(true);
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, { tags: arrayUnion(newTag) });
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  const tagFormHandler = (event: FormEvent) => {
    event.preventDefault();
    if (!newTagRef.current?.value.trim()) return;
    const newId = uuidv4();
    const newTag = {
      id: newId,
      title: newTagRef.current?.value.trim(),
      colorCode: "#ccc",
    };

    createTagHandler(newTag);
  };

  const selectTagHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTag = event.target.value;
    const curTags: string[] = state.tagsIDs || [];
    if (event.target.checked) {
      const newTags = produce(curTags, (draftState) => {
        if (!draftState.find((id) => id === newTag)) {
          draftState.push(newTag);
        }
      });
      dispatch({ type: "UPDATE_TAG", payload: { tagsIDs: newTags } });
    } else {
      const newTags = produce(curTags, (draftState) => {
        draftState.forEach((id, index, arr) => {
          if (id === newTag) {
            arr.splice(index, 1);
            return true;
          }
          return false;
        });
      });
      dispatch({ type: "UPDATE_TAG", payload: { tagsIDs: newTags } });
    }
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
      <>
        <TitleWrapper>
          <CardLogo />
          <TitleInput
            type="text"
            ref={titleRef}
            defaultValue={state.title}
            onBlur={updateTitleHandler}
          />
        </TitleWrapper>
        <Description
          onSubmit={updateDescriptionHandler}
          text={state.description || ""}
        />
        <TimeWrapper>
          {(state.time?.start || state.time?.deadline) && (
            <TimeCheckboxWrapper>
              <TimeCheckbox type="checkbox" />
              <TimeCheckboxLabel>
                {state.time.start &&
                  `${new Date(state.time.start).toDateString()}-`}
                {state.time.deadline &&
                  `${new Date(state.time.deadline).toDateString()}`}
              </TimeCheckboxLabel>
            </TimeCheckboxWrapper>
          )}
          <Form onSubmit={updateTimeHandler}>
            <TimeInputWrapper>
              <TimeInputLabel>Start from:</TimeInputLabel>
              <TimeInput type="datetime-local" ref={startTimeRef} />
            </TimeInputWrapper>
            <TimeInputWrapper>
              <TimeInputLabel>Deadline :</TimeInputLabel>
              <TimeInput type="datetime-local" ref={deadlineRef} />
            </TimeInputWrapper>
            <TimeButton>save time</TimeButton>
          </Form>
        </TimeWrapper>
        <TagsContainer>
          <TagList>
            {state.tagsIDs &&
              tags &&
              tags.map((tag) => {
                if (state.tagsIDs?.includes(tag.id)) {
                  return <div key={tag.id}>{tag.title}</div>;
                }
              })}
          </TagList>
          <TagSelectorList>
            {tags &&
              tags.map((tag) => {
                return (
                  <TagWrapper key={tag.id}>
                    <TagCheckbox
                      type="checkbox"
                      id={tag.id}
                      name="tags"
                      value={tag.id || ""}
                      onChange={selectTagHandler}
                      checked={state.tagsIDs?.includes(tag.id) || false}
                    />
                    <TagCheckboxLabel htmlFor={tag.id}>
                      {tag.title}
                    </TagCheckboxLabel>
                  </TagWrapper>
                );
              })}
          </TagSelectorList>
          <NewTagInputForm onSubmit={tagFormHandler}>
            <NewTagInput type="text" required ref={newTagRef} />
            <NewTagButton>add tag</NewTagButton>
          </NewTagInputForm>
        </TagsContainer>

        <OwnerContainer>
          <OwnerList>
            {ownerInfo &&
              ownerInfo?.map((owner) => {
                return (
                  <OwnerWrapper key={owner.uid}>
                    {owner.displayName}
                  </OwnerWrapper>
                );
              })}
          </OwnerList>
          <OwnerButtonWrapper>
            {members?.map((member) => {
              return (
                <OwnerButton
                  key={`newOwner-${member.uid}`}
                  onClick={() => {
                    addOwnerHandler(member.uid);
                  }}
                >
                  {member.displayName}
                </OwnerButton>
              );
            })}
          </OwnerButtonWrapper>
        </OwnerContainer>
      </>
    );
  };

  return <Wrapper>{cardInfo()}</Wrapper>;
};

export default CardDetail;
