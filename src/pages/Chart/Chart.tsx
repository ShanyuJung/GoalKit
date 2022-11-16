import styled from "styled-components";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import GanttChart from "./components/GanttChart";
import ChartSidebar from "./components/ChartSidebar";
import ProgressChart from "./components/ProgressChart";

const Container = styled.div`
  display: flex;
`;

const ChartArea = styled.div<{ isShowSidebar: boolean }>`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "260px" : "15px")};
  transition: padding 0.3s;
`;

const SubNavbar = styled.div<{ isShowSidebar: boolean }>`
  width: ${(props) => (props.isShowSidebar ? "calc(100vw - 260px)" : "100%")};
  height: 40px;
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #fff;
  z-index: 9;
  transition: width 0.3s;
`;

const ProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const ShowSidebarButton = styled.button<{ isShowSidebar: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: #1976d2;
  top: 60px;
  left: ${(props) => (props.isShowSidebar ? "245px" : "0px")};
  height: 30px;
  width: 30px;
  background-color: aliceblue;
  border-color: #1976d2;
  border-radius: 50%;
  cursor: pointer;
  z-index: 12;
  transition: left 0.3s;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
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
  const [title, setTitle] = useState("");
  const [lists, setLists] = useState<ListInterface[]>([]);
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const { id, chartType } = useParams();

  useEffect(() => {
    if (!id) return;
    const projectRef = doc(db, "projects", id);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      if (snapshot.data()) {
        setIsExist(true);
        const newProject = snapshot.data() as ProjectInterface;
        setTitle(newProject.title);
        setLists(newProject.lists);
      } else setIsExist(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const chartHandler = () => {
    if (chartType === "gantt") {
      return <GanttChart lists={lists} />;
    }
    if (chartType === "progress") {
      return <ProgressChart lists={lists} />;
    }
  };

  return (
    <Container>
      <ChartSidebar isShow={isShowSidebar} />
      <ShowSidebarButton
        isShowSidebar={isShowSidebar}
        onClick={() => {
          setIsShowSidebar((prev) => !prev);
        }}
      >
        {isShowSidebar ? "<" : ">"}
      </ShowSidebarButton>
      <ChartArea isShowSidebar={isShowSidebar}>
        <SubNavbar isShowSidebar={isShowSidebar}>
          <ProjectTitle>{title}</ProjectTitle>
        </SubNavbar>
        {isExist && chartHandler()}
      </ChartArea>
    </Container>
  );
};

export default Chart;
