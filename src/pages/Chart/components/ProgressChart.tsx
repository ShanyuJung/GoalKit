import styled from "styled-components";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  RadialBarChart,
  PolarAngleAxis,
  RadialBar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { useCallback, useEffect, useState } from "react";
import produce from "immer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  flex-wrap: wrap;
  height: calc(100vh - 50px);
`;

const Wrapper = styled.div`
  width: 1540px;
  padding: 20px;
  padding-top: 60px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ChartWrapper = styled.div`
  border: 1px solid #ddd;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ErrorText = styled.div`
  width: 480px;
  padding: 20px;
  font-size: 16px;
`;

const ChartTitle = styled.div`
  padding: 10px 20px;
  font-size: 24px;
  text-align: center;
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

const ProgressChart: React.FC<Props> = ({ lists, tags }) => {
  const [data, setData] = useState(DUMMY_DATA);
  const [tagsData, setTagsData] = useState<
    { name: string; total: number; id: string }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: number) => {
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

    taskNumberHandler();
    tagsDataHandler();
  }, [lists, tags]);

  const taskDistribution = () => {
    if (data[0].total === 0) {
      return (
        <ErrorText>
          There is no task card with planning time, add planning time to
          generate chart.
        </ErrorText>
      );
    }

    return (
      <PieChart width={480} height={300}>
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

  const progressChart = () => {
    if (data[0].total === 0) {
      return (
        <ErrorText>
          There is no task card with planning time, add planning time to
          generate chart.
        </ErrorText>
      );
    }

    return (
      <RadialBarChart
        width={480}
        height={300}
        data={[data[0]]}
        cx={240}
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
          x={240}
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
          x={285}
          y={155}
          textAnchor="middle"
          dominantBaseline="middle"
          className="progress-label"
          fontSize={20}
          fill="#666"
        >
          {`%`}
        </text>
      </RadialBarChart>
    );
  };

  const tagDistribution = () => {
    if (tagsData.length == 0) {
      return (
        <ErrorText>
          There is no task card with planning time, add planning time to
          generate chart.
        </ErrorText>
      );
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

  return (
    <Container>
      <Wrapper>
        <ChartWrapper>
          <ChartTitle>Current Progress</ChartTitle>
          <>{progressChart()}</>
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Task Distribution</ChartTitle>
          <>{taskDistribution()}</>
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Tags Distribution</ChartTitle>
          <>{tagDistribution()}</>
        </ChartWrapper>
      </Wrapper>
    </Container>
  );
};

export default ProgressChart;
