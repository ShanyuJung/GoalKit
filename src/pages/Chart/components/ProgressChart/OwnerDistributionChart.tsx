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
  width: 460px;
  padding: 20px 30px;
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
  const [barChartWidth, setBarChartWidth] = useState(460);

  useEffect(() => {
    const ownerDataHandler = () => {
      const ownerList = lists.flatMap((list) => {
        return list.cards.flatMap((card) => {
          return card.owner;
        });
      });

      const ownerAmount = produce(
        {} as { [key: string]: number },
        (draftState) => {
          ownerList.forEach((owner) => {
            if (!owner) return;
            if (owner in draftState) {
              draftState[`${owner}`] += 1;
            } else {
              draftState[`${owner}`] = 1;
            }
          });
        }
      );

      const displayOwnerData = members.map((member) => {
        if (ownerAmount[`${member.uid}`]) {
          return {
            name: member.displayName,
            total: ownerAmount[`${member.uid}`],
            id: member.uid,
          };
        }
        return {
          name: member.displayName,
          total: 0,
          id: member.uid,
        };
      });

      setOwnerData(displayOwnerData);
    };

    ownerDataHandler();
    if (members.length > 5) {
      setBarChartWidth(members.length * 92);
    }
  }, [lists, members]);

  const tickFormatter = (value: string) => {
    const limit = 20; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  if (ownerData.length == 0) {
    return <ErrorText>Members are not found.</ErrorText>;
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
