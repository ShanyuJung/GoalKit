import styled from "styled-components";

const Wrapper = styled.div`
  width: 100px;
  height: 60px;
  border: 1px solid #000;
  margin: 5px;
`;

interface Props {
  title: string;
}

const Card = ({ title }: Props) => {
  return <Wrapper>{title}</Wrapper>;
};

export default Card;
