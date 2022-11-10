import { uuidv4 } from "@firebase/util";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import produce from "immer";
import { FormEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../../../firebase";

const TagsContainer = styled.div``;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 5px 0px;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: fit-content;
  min-width: 60px;
  max-width: 220px;
  height: 20px;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: #faf3c0;
  cursor: pointer;

  &:hover {
    background-color: #e6c60d80;
  }
`;

const TagPoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e6c60d;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Tag = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`;

const TagSelectorList = styled.div``;

const TagSelectorWrapper = styled.div`
  font-size: 14px;
`;

const TagCheckbox = styled.input``;

const TagCheckboxLabel = styled.label``;

const NewTagInputForm = styled.form``;

const NewTagInput = styled.input``;

const NewTagButton = styled.button``;

interface Props {
  tagsIDs: string[] | undefined;
  tags: { id: string; colorCode: string; title: string }[] | undefined;
  onChange(newTags: string[]): void;
}

const Tags: React.FC<Props> = ({ tagsIDs, tags, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const newTagRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();

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

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTag = event.target.value;
    const curTags: string[] = tagsIDs || [];
    if (event.target.checked) {
      const newTags = produce(curTags, (draftState) => {
        if (!draftState.find((id) => id === newTag)) {
          draftState.push(newTag);
        }
      });
      onChange(newTags);
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
      onChange(newTags);
    }
  };

  return (
    <TagsContainer>
      <TagList>
        {tagsIDs &&
          tags &&
          tags.map((tag) => {
            if (tagsIDs?.includes(tag.id)) {
              return (
                <TagWrapper key={tag.id}>
                  <TagPoint />
                  <Tag>{tag.title}</Tag>
                </TagWrapper>
              );
            }
          })}
      </TagList>
      <TagSelectorList>
        {tags &&
          tags.map((tag) => {
            return (
              <TagSelectorWrapper key={tag.id}>
                <TagCheckbox
                  type="checkbox"
                  id={tag.id}
                  name="tags"
                  value={tag.id || ""}
                  onChange={onChangeHandler}
                  checked={tagsIDs?.includes(tag.id) || false}
                />
                <TagCheckboxLabel htmlFor={tag.id}>
                  {tag.title}
                </TagCheckboxLabel>
              </TagSelectorWrapper>
            );
          })}
      </TagSelectorList>
      <NewTagInputForm onSubmit={tagFormHandler}>
        <NewTagInput type="text" required ref={newTagRef} />
        <NewTagButton>add tag</NewTagButton>
      </NewTagInputForm>
    </TagsContainer>
  );
};

export default Tags;
