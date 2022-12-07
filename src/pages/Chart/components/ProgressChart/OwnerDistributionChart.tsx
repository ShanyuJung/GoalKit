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
import { ListInterface, MemberInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
`;

interface Props {
  lists: ListInterface[];
  members: MemberInterface[];
}

const OwnerDistribution: React.FC<Props> = ({ lists, members }) => {
  const [ownerData, setOwnerData] = useState<
    {
      name: string;
      total: number;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    const ownerDataHandler = () => {
      const newOwnerData = members.map((member) => {
        return { name: member.displayName, total: 0, id: member.uid };
      });
      const displayOwnerData = produce(newOwnerData, (draftState) => {
        draftState.forEach((owner) => {
          lists.forEach((list) => {
            list.cards.forEach((card) => {
              if (card.owner?.includes(owner.id)) {
                owner.total += 1;
              }
            });
          });
        });
      });
      setOwnerData(displayOwnerData);
    };

    ownerDataHandler();
  }, [lists, members]);

  if (ownerData.length == 0) {
    return <ErrorText>Members are not found.</ErrorText>;
  }

  const tickFormatter = (value: string) => {
    const limit = 8; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  let barChartWidth = 460;
  if (ownerData.length > 5) {
    barChartWidth = ownerData.length * 92;
  }

  return (
    <BarChart
      width={barChartWidth}
      height={300}
      data={ownerData}
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
      <Bar dataKey="total" fill="#8884d8" barSize={20} />
    </BarChart>
  );
};

export default OwnerDistribution;
