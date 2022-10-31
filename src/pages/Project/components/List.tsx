import styled from "styled-components";
import Card from "./Card";

const Wrapper = styled.div`
  padding: 5px;
  border: 1px black solid;
`;

const Title = styled.div``;

interface Props {
  title: string;
  cards: { title: string }[];
}

const List = ({ title, cards }: Props) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {cards.map((card) => {
        return <Card title={card.title} />;
      })}
    </Wrapper>
  );
};

export default List;
