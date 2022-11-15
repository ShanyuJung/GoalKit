import styled from "styled-components";

const Wrapper = styled.div`
  margin: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const Progress = () => {
  return (
    <Wrapper>
      <Title>To Do List: </Title>
    </Wrapper>
  );
};

export default Progress;
