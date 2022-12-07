import styled from "styled-components";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { useCallback, useEffect, useState } from "react";
import produce from "immer";
import { CardInterface } from "../../../../types";

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
`;

interface PieChartProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: { name: string; value: number };
  percent: number;
  value: number;
}

const DUMMY_DATA = [
  { name: "Complete", value: 0, total: 0 },
  { name: "In Progress", value: 0, total: 0 },
  { name: "Over Time", value: 0, total: 0 },
  { name: "Without Plan", value: 0, total: 0 },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#999"];

const renderActiveShape = (props: PieChartProps) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 5}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} Card`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface Props {
  lists: ListInterface[];
}

const TaskDistribution: React.FC<Props> = ({ lists }) => {
  const [data, setData] = useState(DUMMY_DATA);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: number, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

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
    <PieChart width={460} height={300}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default TaskDistribution;
