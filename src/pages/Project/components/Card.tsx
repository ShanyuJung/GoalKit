import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 200px;
  min-height: 60px;
  border: 1px solid #000;
  margin: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitleWrapper = styled.div``;

const DescriptionWrapper = styled.div``;

const TimeWrapper = styled.div``;

const TagsContainer = styled.div``;

const TagWrapper = styled.div``;

const Tag = styled.div``;

const OwnerContainer = styled.div``;

const OwnerWrapper = styled.div``;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
}

interface Props {
  cardInfo: CardInterface;
  tags?: { id: string; colorCode: string; title: string }[];
}

const Card: React.FC<Props> = ({ cardInfo, tags }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const deadline = () => {
    if (cardInfo.time?.deadline) {
      return new Date(cardInfo.time?.deadline).toDateString();
    } else {
      return "";
    }
  };

  const tagsCollection = () => {
    return (
      <TagsContainer>
        {cardInfo.tagsIDs &&
          tags &&
          tags.map((tag) => {
            if (cardInfo.tagsIDs?.includes(tag.id)) {
              return <Tag key={tag.id}>{tag.title}</Tag>;
            }
          })}
      </TagsContainer>
    );
  };

  const ownerList = () => {
    return (
      <OwnerContainer>
        {cardInfo.owner &&
          cardInfo.owner.map((owner) => {
            return <OwnerWrapper key={owner}>{owner}</OwnerWrapper>;
          })}
      </OwnerContainer>
    );
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
      {cardInfo.tagsIDs && tags && tagsCollection()}
      {cardInfo.owner && ownerList()}
    </Wrapper>
  );
};

export default Card;
