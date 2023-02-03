import { useEffect, useState } from "react";
import styled from "styled-components";
import produce from "immer";
import { RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { ListInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 460px;
  padding: 20px 30px;
  font-size: 16px;
`;

const DUMMY_TIME_DATA = { start: 0, end: 1, passed: 0 };

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
      width={CHART_SIZE.width}
      height={CHART_SIZE.height}
      data={[timeData]}
      cx={"50%"}
      cy={"50%"}
      innerRadius={CHART_SIZE.innerRadius}
      outerRadius={CHART_SIZE.outerRadius}
      startAngle={CHART_SIZE.startAngle}
      endAngle={CHART_SIZE.endAngle}
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
        cornerRadius={CHART_SIZE.cornerRadius}
        fill={
          Math.round(
            (timeData.passed / (timeData.end - timeData.start)) * 100
          ) > 50
            ? "#FFBB28"
            : "#82ca9d"
        }
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
        {`Duration: ${
          Math.round((timeData.end - timeData.start) / 8640000) / 10
        } Days.`}
      </text>
    </RadialBarChart>
  );
};

export default DurationChart;
