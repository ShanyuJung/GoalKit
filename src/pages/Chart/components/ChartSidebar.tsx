import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as projectIcon } from "../../../assets/board-svgrepo-com.svg";

interface StylesProps {
  isShow: boolean;
}

const SidebarWrapper = styled.div<StylesProps>`
  background-color: ${(props) =>
    props.isShow ? "#1976d2" : "rgba(25,118,210,0.2)"};
  width: ${(props) => (props.isShow ? "260px" : "15px")};
  flex-shrink: 0;
  height: calc(100vh - 50px);
  transition: width 0.3s;
  position: fixed;
  z-index: 10;
`;

const LinkList = styled.div<StylesProps>`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
`;

const LinkWrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
`;

const LinkText = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  border-bottom: solid 2px transparent;
  transition: border-bottom-color 0.3s ease-out;

  &:hover {
    font-weight: 900;
    border-bottom: solid 2px #fff;
  }
`;

const ChartLogo = styled(projectIcon)`
  width: 24px;
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
  const { id } = useParams();

  return (
    <SidebarWrapper isShow={isShow}>
      <LinkList isShow={isShow}>
        <LinkWrapper>
          <StyledLink to={`/project/${id}/`} relative="path">
            <ChartLogo />
            <LinkText>Back to Project</LinkText>
          </StyledLink>
        </LinkWrapper>
      </LinkList>
    </SidebarWrapper>
  );
};

export default ChartSidebar;
