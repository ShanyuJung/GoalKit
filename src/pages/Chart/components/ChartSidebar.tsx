import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";
import { ReactComponent as ganttIcon } from "../../../assets/chart-gantt-svgrepo-com.svg";
import { ReactComponent as pieChartIcon } from "../../../assets/pie-chart-svgrepo-com.svg";

interface StylesProps {
  isShow: boolean;
}

const SidebarWrapper = styled.div<StylesProps>`
  background-color: ${(props) =>
    props.isShow ? "#658DA6" : "rgba(25,118,210,0.2)"};
  width: ${(props) => (props.isShow ? "260px" : "15px")};
  flex-shrink: 0;
  height: calc(100vh - 70px);
  transition: width 0.3s;
  position: fixed;
  z-index: 10;
  filter: brightness(115%);
`;

const LinkList = styled.div<StylesProps>`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
`;

const LinkWrapper = styled.div<{ $selected?: boolean }>`
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 20px;
  cursor: pointer;
  background-color: #658da6;
  filter: ${(props) => (props.$selected ? "brightness(90%)" : "")};

  &:hover {
    filter: brightness(90%);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  height: 50px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
`;

const LinkText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  border-bottom: solid 2px transparent;
  transition: border-bottom-color 0.3s ease-out;
`;

const ProjectLogo = styled(projectIcon)`
  width: 24px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

const GanttLogo = styled(ganttIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

const PieChartLogo = styled(pieChartIcon)`
  width: 20px;
  margin-right: 10px;
  path {
    fill: #fff;
  }

  rect {
    fill: #fff;
  }
`;

interface Props {
  isShow: boolean;
}

const ChartSidebar: React.FC<Props> = ({ isShow }) => {
  const { id, chartType } = useParams();

  return (
    <SidebarWrapper isShow={isShow}>
      <LinkList isShow={isShow}>
        <LinkWrapper>
          <StyledLink to={`/project/${id}/`} relative="path">
            <ProjectLogo />
            <LinkText>Back to Board</LinkText>
          </StyledLink>
        </LinkWrapper>
        <LinkWrapper $selected={chartType === "gantt"}>
          <StyledLink to={`/project/${id}/chart/gantt`} relative="path">
            <GanttLogo />
            <LinkText>Gantt Chart</LinkText>
          </StyledLink>
        </LinkWrapper>
        <LinkWrapper $selected={chartType === "progress"}>
          <StyledLink to={`/project/${id}/chart/progress`} relative="path">
            <PieChartLogo />
            <LinkText>Progress Chart</LinkText>
          </StyledLink>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default ChartSidebar;
