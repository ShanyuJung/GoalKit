import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div``;

const ProjectCard = styled.div``;

const Workspace = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <ProjectCard
        onClick={() => {
          navigate("/project/project1");
        }}
      >
        Project 1
      </ProjectCard>
    </Wrapper>
  );
};

export default Workspace;
