import { useEffect, useState } from "react";
import styled from "styled-components";
import produce from "immer";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { ListInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 460px;
  padding: 20px 30px;
  font-size: 16px;
`;

const CHART_SIZE = {
  width: 460,
  height: 300,
  barSize: 20,
  maxCharacter: 20,
  baseNumber: 5,
  fontSize: 12,
};

interface Props {
  lists: ListInterface[];
  tags: { id: string; colorCode: string; title: string }[];
}

const TagsDistribution: React.FC<Props> = ({ lists, tags }) => {
  const [tagsData, setTagsData] = useState<
    { name: string; total: number; id: string }[]
  >([]);
  const [barChartWidth, setBarChartWidth] = useState<number>(CHART_SIZE.width);

  useEffect(() => {
    const tagsDataHandler = () => {
      const tagList = lists.flatMap((list) => {
        return list.cards.flatMap((card) => {
          return card.tagsIDs;
        });
      });

      const tagAmount = produce(
        {} as { [key: string]: number },
        (draftState) => {
          tagList.forEach((tag) => {
            if (!tag) return;
            if (tag in draftState) {
              draftState[`${tag}`] += 1;
            } else {
              draftState[`${tag}`] = 1;
            }
          });
        }
      );

      const displayTagsData = tags.map((tag) => {
        if (tagAmount[`${tag.id}`]) {
          return { name: tag.title, total: tagAmount[`${tag.id}`], id: tag.id };
        } else {
          return { name: tag.title, total: 0, id: tag.id };
        }
      });

      setTagsData(displayTagsData);
    };

    tagsDataHandler();
    if (tags.length > CHART_SIZE.baseNumber) {
      setBarChartWidth(
        tags.length * (CHART_SIZE.width / CHART_SIZE.baseNumber)
      );
    }
  }, [lists, tags]);

  const tickFormatter = (value: string) => {
    const limit = CHART_SIZE.maxCharacter; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  if (tagsData.length == 0) {
    return (
      <ErrorText>
        There is no tag in this project, add new tag to generate chart.
      </ErrorText>
    );
  }

  return (
    <BarChart
      width={barChartWidth}
      height={CHART_SIZE.height}
      data={tagsData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        fontSize={CHART_SIZE.fontSize}
        tickFormatter={tickFormatter}
      />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#82ca9d" barSize={CHART_SIZE.barSize} />
    </BarChart>
  );
};

export default TagsDistribution;
