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

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
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

interface Props {
  lists: ListInterface[];
  tags: { id: string; colorCode: string; title: string }[];
}

const TagsDistribution: React.FC<Props> = ({ lists, tags }) => {
  const [tagsData, setTagsData] = useState<
    { name: string; total: number; id: string }[]
  >([]);

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
  }, [lists, tags]);

  if (tagsData.length == 0) {
    return <ErrorText>Members are not found.</ErrorText>;
  }

  const tickFormatter = (value: string, index: number) => {
    const limit = 8; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  let barChartWidth = 480;
  if (tagsData.length > 5) {
    barChartWidth = tagsData.length * 96;
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
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#82ca9d" barSize={20} />
    </BarChart>
  );
};

export default TagsDistribution;
