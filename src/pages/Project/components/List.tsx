import styled from "styled-components";
import Card from "./Card";

const Wrapper = styled.div`
  padding: 5px;
  border: 1px black solid;
  margin: 5px;
`;

const Title = styled.div``;

interface Props {
  title: string;
  cards: { title: string; id: string }[];
}

const List = ({ title, cards }: Props) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {cards.map((card) => {
        return <Card title={card.title} key={card.id} />;
      })}
    </Wrapper>
  );
};

export default List;
