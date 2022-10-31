import styled from "styled-components";
import PrivateRoute from "../../components/route/PrivateRoute";
import List from "./components/List";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  display: flex;
`;

const LISTS = [
  {
    title: "List1",
    id: "listQWE",
    cards: [
      { title: "card1", id: "cardQWE" },
      { title: "card2", id: "card123456" },
    ],
  },
  {
    title: "List2",
    id: "listASD",
    cards: [
      { title: "card1", id: "cardASD" },
      { title: "card2", id: "card23461" },
    ],
  },
];

const Project = () => {
  return (
    <PrivateRoute>
      <Wrapper>
        Project1
        <ListWrapper>
          {LISTS.map((list) => {
            return <List title={list.title} cards={list.cards} key={list.id} />;
          })}
        </ListWrapper>
      </Wrapper>
    </PrivateRoute>
  );
};

export default Project;
