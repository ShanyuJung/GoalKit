import { useEffect, useState } from "react";
import styled from "styled-components";
import produce from "immer";
import Swal from "sweetalert2";
import { ReactComponent as toDoIcon } from "../../../../assets/checkbox-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../../../assets/close-svgrepo-com.svg";

const Wrapper = styled.div`
  margin: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToDoIcon = styled(toDoIcon)`
  height: 16px;
  width: 16px;
  margin: 0px 5px;

  path {
    fill: #000;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const ProgressbarWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px 3px;
`;

const ProgressbarText = styled.div`
  font-size: 10px;
`;

const Progressbar = styled.div`
  height: 6px;
  margin: 0px 3px;
  flex-grow: 1;
  background-color: #ccc;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressbarContent = styled.div<{ progress: string }>`
  height: 6px;
  width: ${(props) => props.progress};
  background-color: #61bd4f;
  border-radius: 3px;
  transition: width 0.3s;
`;

const TodoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  &:hover {
    background-color: #ddd;
  }
`;

const TodoCheckbox = styled.input`
  accent-color: #74992e;
  border-color: transparent;
`;

const TodoLabel = styled.label`
  padding-left: 10px;
  font-size: 16px;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CloseButton = styled(closeIcon)`
  width: 20px;
  height: 20px;

  path {
    fill: #ccc;
  }

  &:hover {
    path {
      fill: #333;
    }
  }
`;

interface Props {
  todo: { title: string; isDone: boolean; id: string }[];
  onCheck: (isChecked: boolean, id: string) => void;
  onDelete: (todoID: string) => void;
}

const Todo: React.FC<Props> = ({ todo, onCheck, onDelete }) => {
  const [progress, setProgress] = useState(0);

  const onCheckHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (event.target.checked) {
      onCheck(true, id);
    } else {
      onCheck(false, id);
    }
  };

  const onDeleteHandler = (todoID: string) => {
    Swal.fire({
      title: "Confirm to remove selected task from todo list.",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.value === true) {
        onDelete(todoID);
        Swal.fire("Removed!", "Selected task has been removed.", "success");
      }
    });
  };

  useEffect(() => {
    if (todo.length > 0) {
      const initProgressObj = { total: todo.length, isDone: 0 };
      const newProgressObj = produce(initProgressObj, (draftState) => {
        todo.forEach((item) => {
          if (item.isDone === true) {
            draftState.isDone += 1;
          }
        });
      });
      const newProgress = Math.round(
        (newProgressObj.isDone / newProgressObj.total) * 100
      );
      setProgress(newProgress);
    }
  }, [todo]);

  if (todo.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        <ToDoIcon />
        <Title>To Do List: </Title>
      </TitleWrapper>
      <ProgressbarWrapper>
        <ProgressbarText>{`${progress}%`}</ProgressbarText>
        <Progressbar>
          <ProgressbarContent progress={`${progress}%`} />
        </Progressbar>
      </ProgressbarWrapper>
      <TodoListWrapper>
        {todo.map(({ id, isDone, title }) => {
          return (
            <TodoWrapper key={id}>
              <TodoCheckbox
                id={`todo-${id}`}
                type="checkbox"
                checked={isDone}
                onChange={(e) => {
                  onCheckHandler(e, id);
                }}
              />
              <TodoLabel htmlFor={`todo-${id}`}>{title}</TodoLabel>
              <CloseButton
                onClick={() => {
                  onDeleteHandler(id);
                }}
              />
            </TodoWrapper>
          );
        })}
      </TodoListWrapper>
    </Wrapper>
  );
};

export default Todo;
