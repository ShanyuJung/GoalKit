import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import produce from "immer";
import styled from "styled-components";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  margin: 10px;
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

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string;
  tagsIDs?: string[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface Props {
  listsArray: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
}

const CardDetail: React.FC<Props> = ({ listsArray, tags }) => {
  const [curCard, setCurCard] = useState<CardInterface | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const deadlineRef = useRef<HTMLInputElement | null>(null);
  const newTagRef = useRef<HTMLInputElement | null>(null);
  const { id, cardId } = useParams();

  useEffect(() => {
    if (!cardId || listsArray.length === 0) return;
    const [newList] = listsArray.filter((list) => {
      return list.cards.some((card) => {
        return card.id === cardId;
      });
    });
    const [newCard] = newList.cards.filter((card) => {
      return card.id === cardId;
    });

    setCurCard(newCard);
  }, [listsArray, cardId]);

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

  const updateTitleHandler = () => {
    if (
      !titleRef.current?.value.trim() ||
      titleRef.current?.value.trim() === curCard?.title
    ) {
      return;
    }

    const newTitle = titleRef.current.value.trim();
    const newCard = produce(curCard, (draftState) => {
      if (draftState) {
        draftState.title = newTitle;
      }
    });

    if (newCard) {
      const newLists = newListHandler(newCard);
      updateDataHandler(newLists);
    }
  };

  const updateDescriptionHandler = (event: FormEvent) => {
    event.preventDefault();

    if (
      !descriptionRef.current?.value.trim() ||
      descriptionRef.current?.value.trim() === curCard?.description
    ) {
      return;
    }
    const newDescription = descriptionRef.current.value.trim();
    const newCard = produce(curCard, (draftState) => {
      if (draftState) {
        draftState.description = newDescription;
      }
    });
    if (newCard) {
      const newLists = newListHandler(newCard);
      updateDataHandler(newLists);
    }
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

    const newCard = produce(curCard, (draftState) => {
      if (draftState) {
        draftState.time = newTime;
      }
    });
    if (newCard) {
      const newLists = newListHandler(newCard);
      updateDataHandler(newLists);
    }
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
    if (event.target.checked) {
      const newTag = event.target.value;
      const newCard = produce(curCard, (draftState) => {
        if (draftState && !draftState?.tagsIDs) {
          draftState.tagsIDs = [newTag];
        } else if (
          draftState?.tagsIDs &&
          !draftState.tagsIDs?.find((id) => id === newTag)
        ) {
          draftState.tagsIDs.push(newTag);
        }
      });
      if (newCard) {
        const newLists = newListHandler(newCard);
        updateDataHandler(newLists);
      }
    } else {
      const newTag = event.target.value;
      const newCard = produce(curCard, (draftState) => {
        if (draftState && !draftState?.tagsIDs) {
          return;
        } else if (
          draftState?.tagsIDs &&
          draftState.tagsIDs?.find((id) => id === newTag)
        ) {
          const newState = draftState.tagsIDs.filter((id) => id !== newTag);
          draftState.tagsIDs = newState;
        }
      });
      if (newCard) {
        const newLists = newListHandler(newCard);
        updateDataHandler(newLists);
      }
    }
  };

  const cardInfo = () => {
    if (!curCard) return;

    return (
      <>
        <TitleInput
          type="text"
          ref={titleRef}
          defaultValue={curCard.title}
          onBlur={updateTitleHandler}
        />
        <TextAreaWrapper>
          {curCard.description && <div>{curCard.description}</div>}
          <Form onSubmit={updateDescriptionHandler}>
            <TextAreaLabel htmlFor="description">Description</TextAreaLabel>
            <TextArea
              id="description"
              name="description"
              defaultValue={curCard.description}
              ref={descriptionRef}
            />
            <TextAreaButton>save</TextAreaButton>
          </Form>
        </TextAreaWrapper>
        <TimeWrapper>
          {curCard.time && (
            <TimeCheckboxWrapper>
              <TimeCheckbox type="checkbox" />
              <TimeCheckboxLabel>{`${curCard.time.start}-${curCard.time.deadline}`}</TimeCheckboxLabel>
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
            {curCard.tagsIDs &&
              tags &&
              tags.map((tag) => {
                if (curCard.tagsIDs?.includes(tag.id)) {
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
                      checked={curCard.tagsIDs?.includes(tag.id)}
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
      </>
    );
  };

  return <Wrapper>{cardInfo()}</Wrapper>;
};

export default CardDetail;
