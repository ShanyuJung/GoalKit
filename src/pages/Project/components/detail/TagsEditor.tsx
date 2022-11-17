import produce from "immer";
import { FormEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { uuidv4 } from "@firebase/util";

const TagSelectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px 5px;
  width: 230px;
  background-color: #fff;
`;

const TagSelectorTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TagSelectorTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding: 0px 10px;
`;

const TagSelectorWrapper = styled.div`
  font-size: 14px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const TagCheckbox = styled.input``;

const TagCheckboxLabel = styled.label`
  margin: 0px 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 10px;
  width: 200px;
  border-radius: 5px;
  background-color: #faf3c0;
  cursor: pointer;

  &:hover {
    background-color: #e6c60d80;
  }
`;

const NewTagInputForm = styled.form`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0px 5px;
`;

const NewTagInput = styled.input`
  height: 26px;
  font-size: 16px;
  width: 135px;
`;

const NewTagButton = styled.button`
  width: 70px;
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 10px 0px;
  font-size: 16px;
  border-radius: 5px;
  margin: 10px 0px;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

interface Props {
  tagsIDs: string[] | undefined;
  tags: { id: string; colorCode: string; title: string }[] | undefined;
  onChange(newTags: string[]): void;
}

const TagsEditor: React.FC<Props> = ({ tagsIDs, tags, onChange }) => {
  const newTagRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    newTagRef.current.value = "";
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
    <TagSelectorList>
      <TagSelectorTitleWrapper>
        <TagSelectorTitle>Edit Tags</TagSelectorTitle>
      </TagSelectorTitleWrapper>
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
              <TagCheckboxLabel htmlFor={tag.id}>{tag.title}</TagCheckboxLabel>
            </TagSelectorWrapper>
          );
        })}
      <NewTagInputForm onSubmit={tagFormHandler}>
        <NewTagInput type="text" required ref={newTagRef} />
        <NewTagButton>add tag</NewTagButton>
      </NewTagInputForm>
    </TagSelectorList>
  );
};

export default TagsEditor;
