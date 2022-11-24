import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as dateIcon } from "../../../../assets/clock-svgrepo-com.svg";
import { useOnClickOutside } from "../../../../utils/hooks";
import Swal from "sweetalert2";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TimeWrapper = styled.div`
  margin: 10px;
`;

const TimeTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TimeTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const DateIcon = styled(dateIcon)`
  height: 20px;
  width: 20px;
  margin-right: 6px;

  path {
    fill: #000;
  }
`;

const TimeCheckboxWrapper = styled.div`
  margin: 5px;
  display: flex;
  align-items: center;
  width: fit-content;
`;

const TimeLogo = styled(dateIcon)`
  width: 20px;
  line-height: 20px;

  path {
    fill: #f49d1a;
  }
`;

const TimeCheckbox = styled.input`
  accent-color: #74992e;
  border-color: transparent;
`;

const TimeCheckboxLabel = styled.label`
  padding: 5px 10px;
  font-size: 14px;
`;

const TimeEditAreaWrapper = styled.div<{ isEdit: boolean }>`
  padding: 5px 10px;
  padding: ${(props) => (props.isEdit ? "5px 10px" : "0px 10px")};
  max-height: ${(props) => (props.isEdit ? "500px" : "0px")};
  background-color: #ddd;
  border-radius: 5px;
  overflow: scroll;
  transition: max-height 0.3s;
`;

const TimeInputWrapper = styled.div`
  margin: 10px;
`;

const TimeLabelWrapper = styled.div<{ colorCode: string }>`
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding-left: 10px;
  background-color: ${(props) => props.colorCode};
`;

const TimeInputLabel = styled.label`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  width: 80px;
`;

const TimeInput = styled.input`
  border-radius: 3px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin: 5px 5px;
`;

const TimeButton = styled.button`
  width: 80px;
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 0px 10px;
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
  curStart: number | undefined;
  curDeadline: number | undefined;
  isComplete: boolean;
  onSubmit(start: number, deadline: number): void;
  onCheck(isChecked: boolean): void;
  todo: { title: string; isDone: boolean; id: string }[];
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}

const Time: React.FC<Props> = ({
  curStart,
  curDeadline,
  onSubmit,
  isComplete,
  onCheck,
  todo,
  isEdit,
  setIsEdit,
}) => {
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const deadlineRef = useRef<HTMLInputElement | null>(null);
  const ref = useRef(null);
  const [timeCheckboxColor, setTimeCheckboxColor] = useState(
    "rgba(253, 216, 53, 0.9)"
  );
  const { cardId } = useParams();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const startTime = startTimeRef.current?.value;
    const deadline = deadlineRef.current?.value;

    if (startTime === curStart && deadline === curDeadline) {
      setIsEdit(false);
      return;
    }

    if (startTime && deadline) {
      const newStartTime = new Date(`${startTime}:00Z`).getTime();
      const newDeadline = new Date(`${deadline}:00Z`).getTime();
      if (newStartTime >= newDeadline) {
        Swal.fire(
          "Error!",
          "Start time must not be later than deadline!",
          "warning"
        );

        return;
      }
      onSubmit(newStartTime, newDeadline);
      setIsEdit(false);
    }
  };

  const checkTodoHandler = () => {
    return todo.find((item) => item.isDone === false);
  };

  const onCheckHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isUnDoneTodo = checkTodoHandler();
    if (event.target.checked && !isUnDoneTodo) {
      onCheck(true);
    } else if (event.target.checked && isUnDoneTodo) {
      Swal.fire(
        "You have undone tasks in your todo list!",
        "Check out all todo before complete task.",
        "warning"
      );
    } else {
      onCheck(false);
    }
  };

  useOnClickOutside(ref, () => setIsEdit(false));

  useEffect(() => {
    const TimeCheckboxColorHandler = () => {
      if (isComplete) {
        setTimeCheckboxColor("rgba(139, 195, 74, 0.9)");
      } else if (!isComplete && curDeadline) {
        const curTime = new Date().getTime();
        const newColorCode =
          curDeadline < curTime
            ? "rgba(255, 0, 0, 0.9)"
            : "rgba(253, 216, 53, 0.9)";
        setTimeCheckboxColor(newColorCode);
      }
    };

    TimeCheckboxColorHandler();
  }, [isComplete]);

  return (
    <TimeWrapper>
      <TimeTitleWrapper>
        <DateIcon />
        <TimeTitle>Date:</TimeTitle>
      </TimeTitleWrapper>
      {curStart && curDeadline ? (
        <TimeCheckboxWrapper>
          <TimeCheckbox
            type="checkbox"
            id={`time-checkbox-${cardId}`}
            checked={isComplete}
            onChange={onCheckHandler}
          />
          <TimeLabelWrapper colorCode={timeCheckboxColor}>
            <TimeLogo />
            <TimeCheckboxLabel htmlFor={`time-checkbox-${cardId}`}>
              {`${new Date(curStart).toLocaleDateString()} - ${new Date(
                curDeadline
              ).toLocaleDateString()}`}
            </TimeCheckboxLabel>
          </TimeLabelWrapper>
        </TimeCheckboxWrapper>
      ) : (
        <></>
      )}
      <TimeEditAreaWrapper isEdit={isEdit} ref={ref}>
        <Form onSubmit={submitHandler}>
          <TimeInputWrapper>
            <TimeInputLabel>Start from:</TimeInputLabel>
            <TimeInput type="datetime-local" ref={startTimeRef} required />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInputLabel>Deadline :</TimeInputLabel>
            <TimeInput type="datetime-local" ref={deadlineRef} required />
          </TimeInputWrapper>
          <ButtonWrapper>
            <TimeButton>save</TimeButton>
            <TimeButton
              type="button"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              cancel
            </TimeButton>
          </ButtonWrapper>
        </Form>
      </TimeEditAreaWrapper>
    </TimeWrapper>
  );
};

export default Time;
