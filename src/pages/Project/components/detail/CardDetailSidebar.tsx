import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as trashIcon } from "../../../../assets/trash-svgrepo-com.svg";
import { ReactComponent as toDoIcon } from "../../../../assets/checkbox-svgrepo-com.svg";
import { ReactComponent as dateIcon } from "../../../../assets/clock-svgrepo-com.svg";
import { ReactComponent as ownerIcon } from "../../../../assets/user-svgrepo-com.svg";
import { ReactComponent as tagsIcon } from "../../../../assets/tags-svgrepo-com.svg";
import DropdownButton from "../../../../components/button/DropdownButton";
import { FormEvent, useRef } from "react";
import TagsEditor from "./TagsEditor";
import Swal from "sweetalert2";
import { ListInterface, MemberInterface } from "../../../../types";

const Wrapper = styled.div`
  width: 250px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const ListTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #444;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DateIcon = styled(dateIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

  path {
    fill: #444;
  }
`;

const OwnerIcon = styled(ownerIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

  circle {
    fill: #777;
  }

  path {
    fill: #777;
  }
`;

const TrashIcon = styled(trashIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

  path {
    fill: #777;
  }
`;

const ButtonListItem = styled.div`
  height: 30px;
`;

const CardFeatureButton = styled.button`
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 5px 10px;
  border: none;
  color: #666;
  background-color: #ddd;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

const ToDoIcon = styled(toDoIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

  path {
    fill: #777;
  }
`;

const DropdownChildrenWrapper = styled.div`
  width: 100%;
`;

const NewToDoCard = styled.div`
  width: 100%;
  padding: 5px 10px;
  background-color: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const CardLabel = styled.label`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
`;

const Input = styled.input`
  height: 24px;
  border: 1px solid #aaa;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  padding-left: 5px;
`;

const Button = styled.button`
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 10px;
  font-size: 16px;
  width: 100%;
  border-radius: 5px;
  margin: 10px 0px;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

const OwnerButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 5px;
  background-color: #fff;
`;

const OwnerButton = styled.button`
  width: 100%;
  background-color: #c5cae9;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const TagsIcon = styled(tagsIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

  path {
    fill: #777;
  }
`;

interface Props {
  onDelete: (targetCardID: string) => void;
  todoHandler: (titleText: string) => void;
  setIsEditDate: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  members: MemberInterface[];
  addOwnerHandler(id: string): void;
  tagsIDs: string[] | undefined;
  tags: { id: string; colorCode: string; title: string }[] | undefined;
  onChange(newTags: string[]): void;
  listsArray: ListInterface[];
}

const CardDetailSideBar: React.FC<Props> = ({
  onDelete,
  todoHandler,
  setIsEditDate,
  members,
  addOwnerHandler,
  tagsIDs,
  tags,
  onChange,
  listsArray,
}) => {
  const todoRef = useRef<HTMLInputElement | null>(null);

  const { id, cardId } = useParams();
  const navigate = useNavigate();

  const addTodoListHandler = (event: FormEvent) => {
    event.preventDefault();
    if (todoRef.current?.value.trim()) {
      todoHandler(todoRef.current.value.trim());
      todoRef.current.value = "";
    }
  };

  const checkDeleteCardHandler = () => {
    if (!cardId) return;
    Swal.fire({
      title: "Confirm to delete selected card",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#658da6b4",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e74d3ce3",
    }).then((result) => {
      if (result.value === true) {
        onDelete(cardId);
        navigate(`/project/${id}`);
        Swal.fire("Deleted!", "Selected card has been deleted.", "success");
      }
    });
  };

  return (
    <Wrapper>
      <ListTitle>Edit Card</ListTitle>
      <ButtonList>
        <ButtonListItem>
          <CardFeatureButton
            onClick={() => {
              setIsEditDate((prevIsEdit) => !prevIsEdit);
            }}
          >
            <DateIcon />
            Edit Date
          </CardFeatureButton>
        </ButtonListItem>
        <DropdownButton logo={<ToDoIcon />} text={"Add Todo List"}>
          <DropdownChildrenWrapper>
            <NewToDoCard>
              <Form onSubmit={addTodoListHandler}>
                <CardLabel htmlFor="toDoInput">Add Todo List</CardLabel>
                <Input type="text" id="toDoInput" required ref={todoRef} />
                <Button>Add to do</Button>
              </Form>
            </NewToDoCard>
          </DropdownChildrenWrapper>
        </DropdownButton>
        <DropdownButton logo={<TagsIcon />} text={"Edit Tags"}>
          <DropdownChildrenWrapper>
            <TagsEditor
              tags={tags}
              tagsIDs={tagsIDs}
              onChange={onChange}
              listsArray={listsArray}
            />
          </DropdownChildrenWrapper>
        </DropdownButton>
        <DropdownButton logo={<OwnerIcon />} text={"Add Owners"}>
          <DropdownChildrenWrapper>
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
          </DropdownChildrenWrapper>
        </DropdownButton>
        <ButtonListItem>
          <CardFeatureButton onClick={checkDeleteCardHandler}>
            <TrashIcon />
            Delete Card
          </CardFeatureButton>
        </ButtonListItem>
      </ButtonList>
    </Wrapper>
  );
};

export default CardDetailSideBar;
