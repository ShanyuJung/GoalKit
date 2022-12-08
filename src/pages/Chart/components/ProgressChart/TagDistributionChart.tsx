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
import { ListInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 460px;
  padding: 20px 30px;
  font-size: 16px;
`;

interface Props {
  lists: ListInterface[];
  tags: { id: string; colorCode: string; title: string }[];
}

const TagsDistribution: React.FC<Props> = ({ lists, tags }) => {
  const [tagsData, setTagsData] = useState<
    { name: string; total: number; id: string }[]
  >([]);
  const [barChartWidth, setBarChartWidth] = useState(460);

  useEffect(() => {
    const tagsDataHandler = () => {
      const newTagsData = tags.map((tag) => {
        return { name: tag.title, total: 0, id: tag.id };
      });
      const displayTagsData = produce(newTagsData, (draftState) => {
        draftState.forEach((tag) => {
          lists.forEach((list) => {
            list.cards.forEach((card) => {
              if (card.tagsIDs?.includes(tag.id)) {
                tag.total += 1;
              }
            });
          });
        });
      });
      setTagsData(displayTagsData);
    };

    tagsDataHandler();
    if (tags.length > 5) {
      setBarChartWidth(tags.length * 92);
    }
  }, [lists, tags]);

  const tickFormatter = (value: string) => {
    const limit = 20; // put your maximum character
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
      height={300}
      data={tagsData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" fontSize={12} tickFormatter={tickFormatter} />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#82ca9d" barSize={20} />
    </BarChart>
  );
};

export default TagsDistribution;
