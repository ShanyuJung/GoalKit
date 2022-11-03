import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100px;
  height: 60px;
  border: 1px solid #000;
  margin: 5px;
`;

interface Props {
  title: string;
  cardId: string;
}

const Card = ({ title, cardId }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Wrapper
      onClick={() => {
        navigate(`/project/${id}/card/${cardId}`);
      }}
    >
      {title}
    </Wrapper>
  );
};

export default Card;
