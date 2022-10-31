import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";

const Wrapper = styled.div``;

const ProjectCard = styled.div`
  border: 1px #000 solid;
  width: 100px;
  height: 100px;
  margin: 5px;
`;

const Workspace = () => {
  const navigate = useNavigate();

  return (
    <PrivateRoute>
      <Wrapper>
        <ProjectCard
          onClick={() => {
            navigate("/project/project1");
          }}
        >
          Project 1
        </ProjectCard>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Workspace;
