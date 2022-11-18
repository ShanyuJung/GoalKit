import styled from "styled-components";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import produce from "immer";
import { Timestamp } from "firebase/firestore";
import ProgressPieChart from "./ProgressPieChart";
import TaskDistribution from "./TaskDistributionChart";
import OwnerDistribution from "./OwnerDistributionChart";
import TagsDistribution from "./TagDistributionChart";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100vh - 50px);
`;

const Wrapper = styled.div`
  width: 1540px;
  padding: 20px;
  padding-top: 60px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ChartWrapper = styled.div`
  border: 1px solid #ddd;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: #fff;
`;

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
`;

const ChartTitle = styled.div`
  padding: 10px 20px;
  font-size: 24px;
  text-align: center;
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

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
}

interface Props {
  lists: ListInterface[];
  tags: { id: string; colorCode: string; title: string }[];
  members: Member[];
}

const ProgressChart: React.FC<Props> = ({ lists, tags, members }) => {
  return (
    <Container>
      <Wrapper>
        <ChartWrapper>
          <ChartTitle>Current Progress</ChartTitle>
          <ProgressPieChart lists={lists} />
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Task Distribution</ChartTitle>
          <TaskDistribution lists={lists} />
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Task Owner Distribution</ChartTitle>
          <OwnerDistribution lists={lists} members={members} />
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Tags Distribution</ChartTitle>
          <TagsDistribution lists={lists} tags={tags} />
        </ChartWrapper>
      </Wrapper>
    </Container>
  );
};

export default ProgressChart;
