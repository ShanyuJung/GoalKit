import styled from "styled-components";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { TaskType } from "gantt-task-react/dist/types/public-types";
import GanttChart from "./components/GanttChart";

const Container = styled.div`
  display: flex;
`;

const ChartArea = styled.div``;

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

interface ProjectInterface {
  id: string;
  title: string;
  lists: ListInterface[];
  tags?: { id: string; colorCode: string; title: string }[];
  draggingLists?: string[];
  draggingCards?: string[];
}

const Chart = () => {
  const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [view, setView] = useState(ViewMode.Day);
  const { id, chartType } = useParams();

  useEffect(() => {
    if (!id) return;
    const projectRef = doc(db, "projects", id);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        const newProject = snapshot.data() as ProjectInterface;
        setLists(newProject.lists);
      } else setIsExist(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const chartHandler = () => {
    if (chartType === "gantt") return <GanttChart lists={lists} />;
  };

  return (
    <Container>
      <ChartArea>{isExist && chartHandler()}</ChartArea>
    </Container>
  );
};

export default Chart;
