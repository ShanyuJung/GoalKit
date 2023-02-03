import ProgressPieChart from "./ProgressPieChart";
import TaskDistribution from "./TaskDistributionChart";
import OwnerDistribution from "./OwnerDistributionChart";
import TagsDistribution from "./TagDistributionChart";
import DurationChart from "./DurationChart";
import styled from "styled-components";
import { ListInterface, MemberInterface } from "../../../../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100vh - 70px);
`;

const Wrapper = styled.div`
  max-width: 1540px;
  padding: 20px;
  padding-top: 60px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ChartWrapper = styled.div`
  border: 1px solid #ddd;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: #fff;
`;

const ChartTitle = styled.div`
  padding: 10px 20px;
  font-size: 24px;
  text-align: center;
`;

interface Props {
  lists: ListInterface[];
  tags: { id: string; colorCode: string; title: string }[];
  members: MemberInterface[];
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
          <ChartTitle>Project Duration</ChartTitle>
          <DurationChart lists={lists} />
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
