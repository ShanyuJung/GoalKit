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

const DUMMY_TIME_DATA = { start: 0, end: 1, passed: 0 };

interface Props {
  lists: ListInterface[];
}

const DurationChart: React.FC<Props> = ({ lists }) => {
  const [timeData, setTimeData] =
    useState<{ start: number; end: number; passed: number }>(DUMMY_TIME_DATA);

  useEffect(() => {
    const timeDataHandler = () => {
      const newTimeData = produce(DUMMY_TIME_DATA, (draftState) => {
        lists.forEach((list) => {
          list.cards.forEach((card) => {
            if (card.time?.start && draftState.start === 0) {
              draftState.start = card.time.start;
            }
            if (card.time?.deadline && draftState.end === 1) {
              draftState.end = card.time.deadline;
            }
            if (card.time?.start && card.time?.start < draftState.start) {
              draftState.start = card.time.start;
            }
            if (card.time?.deadline && card.time?.deadline > draftState.end) {
              draftState.end = card.time.deadline;
            }
          });
        });
        const curTime = new Date().getTime();
        draftState.passed = curTime - draftState.start;
      });
      setTimeData({ ...newTimeData });
    };
    timeDataHandler();
  }, [lists]);

  if (timeData.start === 0) {
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
      data={[timeData]}
      cx={230}
      cy={150}
      innerRadius={110}
      outerRadius={130}
      startAngle={90}
      endAngle={-270}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, timeData.end - timeData.start]}
        angleAxisId={0}
        tick={false}
      />
      <RadialBar
        background
        dataKey="passed"
        cornerRadius={30 / 2}
        fill={
          Math.round(
            (timeData.passed / (timeData.end - timeData.start)) * 100
          ) > 50
            ? "#FFBB28"
            : "#82ca9d"
        }
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
        {`${
          Math.round(
            (timeData.passed / (timeData.end - timeData.start)) * 100
          ) >= 100
            ? "100"
            : `${Math.round(
                (timeData.passed / (timeData.end - timeData.start)) * 100
              )}`
        }`}
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
        {`Duration: ${
          Math.round((timeData.end - timeData.start) / 8640000) / 10
        } Days.`}
      </text>
    </RadialBarChart>
  );
};

export default DurationChart;
