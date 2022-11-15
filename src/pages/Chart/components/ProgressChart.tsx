import styled from "styled-components";

interface StylesProps {
  isShowSidebar: boolean;
}

const Container = styled.div<StylesProps>`
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.isShowSidebar ? "280px" : "20px")};
  transition: padding 0.3s;
`;

interface Props {
  isShowSidebar: boolean;
}

const ProgressChart: React.FC<Props> = ({ isShowSidebar }) => {
  return <Container isShowSidebar={isShowSidebar}>Progress</Container>;
};

export default ProgressChart;
