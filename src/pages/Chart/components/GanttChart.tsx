import styled from "styled-components";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { useEffect, useState } from "react";
import { TaskType } from "gantt-task-react/dist/types/public-types";
import { useParams } from "react-router-dom";
import { ListInterface } from "../../../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  padding-top: 60px;
  min-width: 360px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  padding: 20px;
`;

const ViewModeSelectWrapper = styled.div`
  position: relative;
  background-color: #e6e6e6;
  border-radius: 4px;
  padding: 0px 10px 0px 0px;
`;

const ViewModeSelect = styled.select`
  font-size: 1rem;
  font-weight: normal;
  max-width: 100%;
  padding: 8px 24px 8px 10px;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 808px) {
    font-size: 0.8rem;
    padding: 6px 12px 6px 8px;
  }
`;

const ChartDashboardWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const TogglePillWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #e6e6e6;
  border-radius: 4px;
  padding: 0px 10px 0px 10px;
  height: 35px;

  @media (max-width: 808px) {
    height: 29px;
  }
`;

const TogglePill = styled.div`
  display: flex;
  align-items: center;
  height: 2em;
`;

const ToggleInput = styled.input`
  display: none;

  &:checked + label {
    background: #47cf73;
  }

  &:checked + label:before {
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
    left: 1.6em;
    -webkit-transform: rotate(295deg);
    transform: rotate(295deg);
  }

  @media (max-width: 808px) {
    &:checked + label:before {
      left: 1em;
    }
  }
`;

const TogglePillLabel = styled.label`
  display: block;
  position: relative;
  width: 3em;
  height: 1.6em;
  border-radius: 1em;
  background: #e84d4d;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  -webkit-transition: background 0.1s ease-in-out;
  transition: background 0.1s ease-in-out;

  &::before {
    content: "";
    display: block;
    width: 1.2em;
    height: 1.2em;
    border-radius: 1em;
    background: #fff;
    box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 0.2em;
    top: 0.2em;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  @media (max-width: 808px) {
    width: 2em;
    height: 1.2em;

    &::before {
      width: 0.8em;
      height: 0.8em;
    }
  }
`;

const TogglePillText = styled.label`
  font-size: 16px;
  font-weight: 400;

  @media (max-width: 808px) {
    font-size: 0.8rem;
  }
`;

interface Props {
  lists: ListInterface[];
}

const GanttChart: React.FC<Props> = ({ lists }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState(ViewMode.Day);
  const [columnWidth, setColumnWidth] = useState<number>(45);
  const [isHeader, setIsHeader] = useState<boolean>(true);
  const { projectID } = useParams();

  const viewModeHandler = (modeType: ViewMode) => {
    switch (modeType) {
      case ViewMode.HalfDay:
        setColumnWidth(45);
        break;
      case ViewMode.Day:
        setColumnWidth(45);
        break;
      case ViewMode.Week:
        setColumnWidth(120);
        break;
      case ViewMode.Month:
        setColumnWidth(180);
        break;
      case ViewMode.Year:
        setColumnWidth(360);
        break;
      default:
        setColumnWidth(45);
    }
    setView(modeType);
  };

  const showHeaderHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsHeader(true);
    } else {
      setIsHeader(false);
    }
  };

  useEffect(() => {
    const listTransformHandler = () => {
      if (lists.length === 0) return;

      const newTasks: Task[] = [];
      lists.forEach((list) => {
        list.cards.forEach((card) => {
          if (
            card.time?.start &&
            card.time?.deadline &&
            card.time?.start < card.time?.deadline
          ) {
            const newStart = new Date(card.time?.start);
            const newDeadline = new Date(card.time.deadline);

            const newCard = {
              start: new Date(
                newStart.getFullYear(),
                newStart.getMonth(),
                newStart.getDate()
              ),
              end: new Date(
                newDeadline.getFullYear(),
                newDeadline.getMonth(),
                newDeadline.getDate()
              ),
              name: card.title,
              id: card.id,
              type: "task" as TaskType,
              progress: 100,
              isDisabled: true,
              styles: {
                progressColor: "#ffbb54",
                progressSelectedColor: "#ff9e0d",
              },
            };
            newTasks.push(newCard);
          }
        });
      });

      const displayTasks = newTasks.sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      });

      setTasks(displayTasks);
    };
    listTransformHandler();
  }, [lists]);

  const renderDisplayChart = () => {
    if (tasks.length === 0) {
      return (
        <div>
          There is no task card with planning time, add planning time to
          generate gantt chart.
        </div>
      );
    }
    return (
      <Gantt
        tasks={tasks}
        rowHeight={40}
        fontSize={"10px"}
        viewMode={view}
        listCellWidth={isHeader ? "155px" : ""}
        columnWidth={columnWidth}
      />
    );
  };

  return (
    <Container>
      <Wrapper>
        <ChartDashboardWrapper>
          <ViewModeSelectWrapper>
            <ViewModeSelect
              defaultValue={"Day"}
              onChange={(e) => {
                viewModeHandler(e.target.value as ViewMode);
              }}
            >
              <option>Half Day</option>
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </ViewModeSelect>
          </ViewModeSelectWrapper>
          <TogglePillWrapper>
            <TogglePillText htmlFor={`${projectID}-gantt-checkbox`}>
              Show Header :
            </TogglePillText>
            <TogglePill>
              <ToggleInput
                type="checkbox"
                id={`${projectID}-gantt-checkbox`}
                checked={isHeader}
                onChange={showHeaderHandler}
              />
              <TogglePillLabel
                htmlFor={`${projectID}-gantt-checkbox`}
              ></TogglePillLabel>
            </TogglePill>
          </TogglePillWrapper>
        </ChartDashboardWrapper>
      </Wrapper>
      <ChartWrapper>{renderDisplayChart()}</ChartWrapper>
    </Container>
  );
};

export default GanttChart;
