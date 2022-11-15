import produce from "immer";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as ToDoIcon } from "../../../../assets/checkbox-svgrepo-com.svg";

const Wrapper = styled.div`
  margin: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToDoLogo = styled(ToDoIcon)`
  height: 16px;
  width: 16px;
  margin-right: 10px;

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
`;

const TodoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

const TodoCheckbox = styled.input`
  accent-color: #74992e;
  border-color: transparent;
`;

const TodoLabel = styled.label`
  padding-left: 10px;
  font-size: 16px;
`;

interface Props {
  todo: { title: string; isDone: boolean; id: string }[];
  onCheck: (isChecked: boolean, id: string) => void;
}

const Todo: React.FC<Props> = ({ todo, onCheck }) => {
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
    return <></>;
  }

  return (
    <Wrapper>
      <TitleWrapper>
        <ToDoLogo />
        <Title>To Do List: </Title>
      </TitleWrapper>
      <ProgressbarWrapper>
        <ProgressbarText>{`${progress}%`}</ProgressbarText>
        <Progressbar>
          <ProgressbarContent progress={`${progress}%`} />
        </Progressbar>
      </ProgressbarWrapper>
      <TodoListWrapper>
        {todo.map((item) => {
          return (
            <TodoWrapper key={item.id}>
              <TodoCheckbox
                id={`todo-${item.id}`}
                type="checkbox"
                checked={item.isDone}
                onChange={(e) => {
                  onCheckHandler(e, item.id);
                }}
              />
              <TodoLabel htmlFor={`todo-${item.id}`}>{item.title}</TodoLabel>
            </TodoWrapper>
          );
        })}
      </TodoListWrapper>
    </Wrapper>
  );
};

export default Todo;
