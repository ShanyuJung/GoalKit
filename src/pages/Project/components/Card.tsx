import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as DescriptionLogo } from "../../../assets/text-description-svgrepo-com.svg";

const Container = styled.div`
  width: 240px;
  min-height: 60px;
  margin: 10px 5px;
  background-color: #fff;
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  box-shadow: 2px 3px 0px rgba(0, 0, 0, 0.15);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TitleWrapper = styled.div``;

const DescriptionIcon = styled(DescriptionLogo)`
  margin: 4px 0px;
  path {
    fill: #828282;
  }
`;

const TimeWrapper = styled.div``;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
  margin: 5px 0px;
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: fit-content;
  min-width: 60px;
  max-width: 220px;
  height: 16px;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: #faf3c0;
  cursor: pointer;

  &:hover {
    background-color: #e6c60d80;
  }
`;

const TagPoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e6c60d;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Tag = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 10px;
`;

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
              return (
                <TagWrapper key={tag.id}>
                  <TagPoint />
                  <Tag>{tag.title}</Tag>
                </TagWrapper>
              );
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
    <Container
      onClick={() => {
        navigate(`/project/${id}/card/${cardInfo.id}`);
      }}
    >
      <Wrapper>
        {cardInfo.tagsIDs && tags && tagsCollection()}
        <TitleWrapper>{cardInfo.title}</TitleWrapper>
        {cardInfo.description && <DescriptionIcon />}
        {cardInfo.time && <TimeWrapper>{deadline()}</TimeWrapper>}
        {cardInfo.owner && ownerList()}
      </Wrapper>
    </Container>
  );
};

export default Card;
