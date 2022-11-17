import produce from "immer";
import { FormEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { uuidv4 } from "@firebase/util";
import { ReactComponent as editIcon } from "../../../../assets/edit-svgrepo-com.svg";

const TagSelectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px 5px 5px 5px;
  width: 230px;
  background-color: #fff;
`;

const TagSelectorWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const TagCheckbox = styled.input``;

const TagLabelWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 5px;
  width: 190px;
  border-radius: 5px;
  padding-right: 10px;

  &::before {
    position: absolute;
    content: "";
    width: 190px;
    border-radius: 5px;
    height: 25px;
    background-color: #faf3c0;
    z-index: -1;
    opacity: 0.4;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

const TagCheckboxLabel = styled.label`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 10px;
  font-size: 14px;
  flex-grow: 1;
  cursor: pointer;
`;

const EditIcon = styled(editIcon)`
  height: 12px;
  width: 12px;
  cursor: pointer;

  path {
    fill: transparent;
  }

  &:hover {
    path {
      fill: #777;
    }
  }
`;

const NewTagInputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  padding: 5px 5px;
  margin-top: 5px;
  width: 100%;
`;

const NewTagFormLabel = styled.label`
  font-size: 14px;
  padding-left: 2px;
  width: 100%;
`;

const NewTagInput = styled.input`
  height: 26px;
  font-size: 16px;
  width: 100%;
`;

const NewTagButton = styled.button`
  width: 100%;
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 10px 0px;
  font-size: 16px;
  border-radius: 5px;
  margin: 5px 0px;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

const ColorSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 185px;
  gap: 1px;
  width: 100%;
`;

const ColorBlock = styled.div<{ colorCode: string; selectColor: string }>`
  background-color: ${(props) => props.colorCode};
  outline: ${(props) =>
    props.selectColor === props.colorCode ? "1px blue solid" : "none"};
  border: 2px solid #fff;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
`;

const TAG_COLOR_LIST = [
  "#7BC86C",
  "#5AAC44",
  "#49852E",
  "#298FCA",
  "#0079BF",
  "#094C72",
  "#F5DD29",
  "#E6C60D",
  "#CCA42B",
  "#29CCE5",
  "#00AECC",
  "#0082A0",
  "#FFAF3F",
  "#E79217",
  "#B4760F",
  "#6DECA9",
  "#4ED583",
  "#49AA54",
  "#EF7564",
  "#CF513D",
  "#933B27",
  "#FF8ED4",
  "#E568AF",
  "#AE4270",
  "#EDDBF4",
  "#CD8DE5",
  "#A86CC1",
  "#DFE1E6",
  "#C1C7D0",
  "#777777",
];

interface Props {
  tagsIDs: string[] | undefined;
  tags: { id: string; colorCode: string; title: string }[] | undefined;
  onChange(newTags: string[]): void;
}

const TagsEditor: React.FC<Props> = ({ tagsIDs, tags, onChange }) => {
  const newTagRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectColor, setSelectColor] = useState("#7BC86C");
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
      colorCode: selectColor,
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

  const startEditHandler = () => {
    setIsEdit(true);
  };

  const tagSelector = () => {
    return (
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
                <TagLabelWrapper>
                  <TagCheckboxLabel htmlFor={tag.id}>
                    {tag.title}
                  </TagCheckboxLabel>
                  <EditIcon onClick={startEditHandler} />
                </TagLabelWrapper>
              </TagSelectorWrapper>
            );
          })}
        <NewTagInputForm onSubmit={tagFormHandler}>
          <NewTagFormLabel>Tag name:</NewTagFormLabel>
          <NewTagInput type="text" required ref={newTagRef} />
          <NewTagFormLabel>Select color:</NewTagFormLabel>
          <ColorSelectorWrapper>
            {TAG_COLOR_LIST.map((item) => {
              return (
                <ColorBlock
                  colorCode={item}
                  selectColor={selectColor}
                  onClick={() => {
                    setSelectColor(item);
                  }}
                />
              );
            })}
          </ColorSelectorWrapper>
          <NewTagButton>add tag</NewTagButton>
        </NewTagInputForm>
      </TagSelectorList>
    );
  };

  const tagEditBoard = () => {
    return <div>EDITING</div>;
  };

  return <>{isEdit ? tagEditBoard() : tagSelector()}</>;
};

export default TagsEditor;
