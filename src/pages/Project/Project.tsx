import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
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
    <PrivateRoute>
      <Wrapper>
        Project1
        <ListWrapper>
          {LISTS.map((list) => {
            return <List title={list.title} cards={list.cards} />;
          })}
        </ListWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Project;
