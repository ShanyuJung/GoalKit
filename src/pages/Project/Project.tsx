import styled from "styled-components";
import List from "./components/List";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  display: flex;
`;

const LISTS = [
  { title: "List1", cards: [{ title: "card1" }, { title: "card2" }] },
];

const Project = () => {
  return (
    <Wrapper>
      Project1
      <ListWrapper>
        {LISTS.map((list) => {
          return <List title={list.title} cards={list.cards} />;
        })}
      </ListWrapper>
    </Wrapper>
  );
};

export default Project;
