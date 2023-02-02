import styled from "styled-components";
import { RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { useEffect, useState } from "react";
import produce from "immer";
import { ListInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 460px;
  padding: 20px 30px;
  font-size: 16px;
`;

const DUMMY_DATA = [
  { name: "Complete", value: 0, total: 0 },
  { name: "In Progress", value: 0, total: 0 },
  { name: "Over Time", value: 0, total: 0 },
  { name: "Without Plan", value: 0, total: 0 },
];

const CHART_SIZE = {
  width: 460,
  height: 300,
  innerRadius: 110,
  outerRadius: 130,
  startAngle: 90,
  endAngle: -270,
  cornerRadius: 15,
  percentageFontSize: 50,
  percentageMarkX: 275,
  percentageMarkY: 155,
  percentageMarkFontSize: 20,
  detailFontSize: 14,
  detailY: 185,
};

interface Props {
  lists: ListInterface[];
}

const ProgressPieChart: React.FC<Props> = ({ lists }) => {
  const [data, setData] =
    useState<{ name: string; value: number; total: number }[]>(DUMMY_DATA);

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
      width={CHART_SIZE.width}
      height={CHART_SIZE.height}
      data={[data[0]]}
      cx={"50%"}
      cy={"50%"}
      innerRadius={CHART_SIZE.innerRadius}
      outerRadius={CHART_SIZE.outerRadius}
      startAngle={CHART_SIZE.startAngle}
      endAngle={CHART_SIZE.endAngle}
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
        cornerRadius={CHART_SIZE.cornerRadius}
        fill="#82ca9d"
      />
      <text
        x={CHART_SIZE.width / 2}
        y={CHART_SIZE.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={CHART_SIZE.percentageFontSize}
        fill="#666"
      >
        {`${Math.round((data[0].value / data[0].total) * 100)}`}
      </text>
      <text
        x={CHART_SIZE.percentageMarkX}
        y={CHART_SIZE.percentageMarkY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={CHART_SIZE.percentageMarkFontSize}
        fill="#666"
      >
        {"%"}
      </text>
      <text
        x={CHART_SIZE.width / 2}
        y={CHART_SIZE.detailY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fontSize={CHART_SIZE.detailFontSize}
        fill="#666"
      >
        {`${data[0].value} / ${data[0].total} Card Complete.`}
      </text>
    </RadialBarChart>
  );
};

export default ProgressPieChart;
