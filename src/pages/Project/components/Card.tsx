import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100px;
  border: 1px solid #000;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div``;

const DescriptionWrapper = styled.div``;

const TimeWrapper = styled.div``;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string;
  tags?: string[];
}

interface Props {
  cardInfo: CardInterface;
}

const Card: React.FC<Props> = ({ cardInfo }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const deadline = () => {
    if (cardInfo.time?.deadline) {
      return new Date(cardInfo.time?.deadline).toDateString();
    } else {
      return "";
    }
  };

  return (
    <Wrapper
      onClick={() => {
        navigate(`/project/${id}/card/${cardInfo.id}`);
      }}
    >
      <TitleWrapper>{cardInfo.title}</TitleWrapper>
      {cardInfo.description && (
        <DescriptionWrapper>Description</DescriptionWrapper>
      )}
      {cardInfo.time && <TimeWrapper>{deadline()}</TimeWrapper>}
    </Wrapper>
  );
};

export default Card;
