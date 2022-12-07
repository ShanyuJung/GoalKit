import styled from "styled-components";
import { RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { useEffect, useState } from "react";
import produce from "immer";
import { ListInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
`;

const DUMMY_DATA = [
  { name: "Complete", value: 0, total: 0 },
  { name: "In Progress", value: 0, total: 0 },
  { name: "Over Time", value: 0, total: 0 },
  { name: "Without Plan", value: 0, total: 0 },
];

interface Props {
  lists: ListInterface[];
}

const ProgressPieChart: React.FC<Props> = ({ lists }) => {
  const [data, setData] = useState(DUMMY_DATA);

  useEffect(() => {
    const taskNumberHandler = () => {
      const newData = produce(DUMMY_DATA, (draftState) => {
        const curTime = new Date().getTime();
        lists.forEach((list) => {
          list.cards.forEach((card) => {
            if (card.complete) {
              draftState[0].value += 1;
            } else if (
              !card.complete &&
              card.time?.deadline &&
              card.time?.deadline > curTime
            ) {
              draftState[1].value += 1;
            } else if (
              !card.complete &&
              card.time?.deadline &&
              card.time?.deadline < curTime
            ) {
              draftState[2].value += 1;
            } else {
              draftState[3].value += 1;
            }
            draftState.forEach((item) => {
              item.total += 1;
            });
          });
        });
      });
      setData(newData);
    };

    taskNumberHandler();
  }, [lists]);

  if (data[0].total === 0) {
    return (
      <ErrorText>
        There is no task card with planning time, add planning time to generate
        chart.
      </ErrorText>
    );
  }

  return (
    <RadialBarChart
      width={460}
      height={300}
      data={[data[0]]}
      cx={230}
      cy={150}
      innerRadius={110}
      outerRadius={130}
      startAngle={90}
      endAngle={-270}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, data[0].total]}
        angleAxisId={0}
        tick={false}
      />
      <RadialBar
        background
        dataKey="value"
        cornerRadius={30 / 2}
        fill="#82ca9d"
      />
      <text
        x={230}
        y={150}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={50}
        fill="#666"
      >
        {`${Math.round((data[0].value / data[0].total) * 100)}`}
      </text>
      <text
        x={275}
        y={155}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={20}
        fill="#666"
      >
        {"%"}
      </text>
      <text
        x={230}
        y={185}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={14}
        fill="#666"
      >
        {`${data[0].value} / ${data[0].total} Card Complete.`}
      </text>
    </RadialBarChart>
  );
};

export default ProgressPieChart;
