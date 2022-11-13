import styled from "styled-components";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { useEffect, useState } from "react";
import { TaskType } from "gantt-task-react/dist/types/public-types";

const ChartDashboardWrapper = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
}

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface Props {
  lists: ListInterface[];
}

const GanttChart: React.FC<Props> = ({ lists }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState(ViewMode.Day);
  const [columnWidth, setColumnWidth] = useState(45);

  const viewModeHandler = (modeType: string) => {
    if (modeType === "Half Day") {
      setView(ViewMode.HalfDay);
      setColumnWidth(45);
    } else if (modeType === "Day") {
      setView(ViewMode.Day);
      setColumnWidth(45);
    } else if (modeType === "Week") {
      setView(ViewMode.Week);
      setColumnWidth(120);
    } else if (modeType === "Month") {
      setView(ViewMode.Month);
      setColumnWidth(180);
    } else if (modeType === "Year") {
      setView(ViewMode.Year);
      setColumnWidth(360);
    }
  };

  useEffect(() => {
    const listTransformHandler = () => {
      if (lists.length === 0) return;
      const newTasks: Task[] = [];
      lists.forEach((list) => {
        list.cards.forEach((card) => {
          if (card.time?.start && card.time?.deadline) {
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

      console.log(newTasks);
      setTasks(newTasks);
    };
    listTransformHandler();
  }, [lists]);

  const displayChart = () => {
    if (tasks.length > 0) {
      return (
        <Gantt
          tasks={tasks}
          rowHeight={40}
          fontSize={"10px"}
          viewMode={view}
          listCellWidth={true ? "155px" : ""}
          columnWidth={columnWidth}
        />
      );
    }
  };

  return (
    <Container>
      <Wrapper>
        <ChartDashboardWrapper>
          <select
            defaultValue={"Day"}
            onChange={(e) => {
              viewModeHandler(e.target.value);
            }}
          >
            <option>Half Day</option>
            <option>Day</option>
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
        </ChartDashboardWrapper>
      </Wrapper>
      <Wrapper>{displayChart()}</Wrapper>
    </Container>
  );
};

export default GanttChart;
