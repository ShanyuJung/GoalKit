import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as dateIcon } from "../../../../assets/clock-svgrepo-com.svg";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TimeWrapper = styled.div`
  margin: 10px;
`;

const TimeTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const TimeCheckboxWrapper = styled.div<{ colorCode: string }>`
  margin: 5px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.colorCode};
  width: fit-content;
  border-radius: 5px;
`;

const TimeLogo = styled(dateIcon)`
  width: 20px;
  line-height: 20px;

  path {
    fill: #f9a825;
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

const TimeEditButton = styled.button<{ isEdit: boolean }>`
  background-color: inherit;
  border: 1px #999 solid;
  border-radius: 5px;
  margin: 0px 5px;
  display: ${(props) => (props.isEdit ? "none" : "block")};

  &:hover {
    background-color: #999;
  }
`;

const TimeEditAreaWrapper = styled.div<{ isEdit: boolean }>`
  padding: 5px 10px;
  display: ${(props) => (props.isEdit ? "block" : "none !important")};
`;

const TimeInputWrapper = styled.div`
  margin: 10px;
`;

const TimeInputLabel = styled.label`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  width: 80px;
`;

const TimeInput = styled.input``;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin: 5px 5px;
`;

const TimeButton = styled.button`
  width: 70px;
  font-size: 16px;
  color: #fff;
  background-color: #42a5f5;
  height: 26px;
  line-height: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

interface Props {
  curStart: number | undefined;
  curDeadline: number | undefined;
  isComplete: boolean;
  onSubmit(start: number, deadline: number): void;
  onCheck(isChecked: boolean): void;
}

const Time: React.FC<Props> = ({
  curStart,
  curDeadline,
  onSubmit,
  isComplete,
  onCheck,
}) => {
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const deadlineRef = useRef<HTMLInputElement | null>(null);
  const [timeCheckboxColor, setTimeCheckboxColor] = useState("#FDD835");
  const [isEdit, setIsEdit] = useState(false);
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
        alert("Start time must not be later than deadline!");
        return;
      }
      onSubmit(newStartTime, newDeadline);
      setIsEdit(false);
    }
  };

  const onCheckHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onCheck(true);
    } else {
      onCheck(false);
    }
  };

  useEffect(() => {
    const TimeCheckboxColorHandler = () => {
      if (isComplete) {
        setTimeCheckboxColor("#74992e");
      } else if (!isComplete && curDeadline) {
        const curTime = new Date().getTime();
        const newColorCode = curDeadline < curTime ? "#EF5350" : "#FDD835";
        setTimeCheckboxColor(newColorCode);
      }
    };

    TimeCheckboxColorHandler();
  }, [isComplete]);

  return (
    <TimeWrapper>
      <TimeTitle>Date:</TimeTitle>
      {curStart && curDeadline ? (
        <TimeCheckboxWrapper colorCode={timeCheckboxColor}>
          <TimeCheckbox
            type="checkbox"
            id={`time-checkbox-${cardId}`}
            checked={isComplete}
            onChange={onCheckHandler}
          />
          <TimeLogo />
          <TimeCheckboxLabel htmlFor={`time-checkbox-${cardId}`}>
            {`${new Date(curStart).toLocaleDateString()} - ${new Date(
              curDeadline
            ).toLocaleDateString()}`}
          </TimeCheckboxLabel>
          <TimeEditButton
            isEdit={isEdit}
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </TimeEditButton>
        </TimeCheckboxWrapper>
      ) : (
        <TimeEditButton
          isEdit={isEdit}
          onClick={() => {
            setIsEdit(true);
          }}
        >
          Edit
        </TimeEditButton>
      )}
      <TimeEditAreaWrapper isEdit={isEdit}>
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
