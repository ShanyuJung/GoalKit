import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as TrashIcon } from "../../../../assets/trash-svgrepo-com.svg";
import { ReactComponent as ToDoIcon } from "../../../../assets/checkbox-svgrepo-com.svg";
import DropdownButton from "../../../../components/button/DropdownButton";
import { FormEvent, useRef } from "react";

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

const TrashLogo = styled(TrashIcon)`
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

const ToDoLogo = styled(ToDoIcon)`
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

  &:hover {
    background-color: #0079bf;
  }
`;

interface Props {
  onDelete: (targetCardID: string) => void;
  todoHandler: (titleText: string) => void;
}

const CardDetailSideBar: React.FC<Props> = ({ onDelete, todoHandler }) => {
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
    const r = window.confirm("Check to delete selected card");
    if (r === true) {
      navigate(`/project/${id}`);
      onDelete(cardId || "");
    }
  };

  return (
    <Wrapper>
      <ListTitle>Edit Card</ListTitle>
      <ButtonList>
        <DropdownButton logo={<ToDoLogo />} text={"Add to do list"}>
          <DropdownChildrenWrapper>
            <NewToDoCard>
              <Form onSubmit={addTodoListHandler}>
                <CardLabel htmlFor="toDoInput">Add to do list</CardLabel>
                <Input type="text" id="toDoInput" required ref={todoRef} />
                <Button>Add to do</Button>
              </Form>
            </NewToDoCard>
          </DropdownChildrenWrapper>
        </DropdownButton>
        <ButtonListItem>
          <CardFeatureButton onClick={checkDeleteCardHandler}>
            <TrashLogo />
            Delete Card
          </CardFeatureButton>
        </ButtonListItem>
      </ButtonList>
    </Wrapper>
  );
};

export default CardDetailSideBar;
