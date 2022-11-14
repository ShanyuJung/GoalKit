import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as DescriptionLogo } from "../../../assets/text-description-svgrepo-com.svg";

interface IsDraggingProps {
  isDragging: boolean;
}

const Container = styled.div<IsDraggingProps>`
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
  outline: ${(props) => (props.isDragging ? "2px solid blue" : "none")};
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

const TimeWrapper = styled.div<{ colorCode: string }>`
  background-color: ${(props) => props.colorCode};
  width: fit-content;
  padding: 1px 5px;
  height: 20px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  border-radius: 5px;
`;

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

const OwnerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0px 5px;
`;

const OwnerWrapper = styled.div`
  background-color: #c5cae9;
  padding: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  progress?: number;
}

interface Member {
  uid: string;
  email: string;
  displayName: string;
}

interface Props {
  cardInfo: CardInterface;
  tags?: { id: string; colorCode: string; title: string }[];
  members: Member[];
  draggingCards: string[] | undefined;
}

const Card: React.FC<Props> = ({ cardInfo, tags, members, draggingCards }) => {
  const [timeLabelColor, setTimeLabelColor] = useState(
    "rgba(253, 216, 53, 0.9)"
  );
  const navigate = useNavigate();
  const { id } = useParams();

  const time = () => {
    if (cardInfo.time?.start && cardInfo.time?.deadline) {
      const startDate = new Date(cardInfo.time.start);
      const startMonth = startDate.getMonth();
      const startDay = startDate.getDate();

      const deadlineDate = new Date(cardInfo.time?.deadline);
      const deadlineMonth = deadlineDate.getMonth();
      const deadlineDay = deadlineDate.getDate();
      return (
        <TimeWrapper colorCode={timeLabelColor}>{`${
          startMonth + 1
        }/${startDay} - ${deadlineMonth + 1}/${deadlineDay}`}</TimeWrapper>
      );
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
          members &&
          members.map((owner) => {
            if (cardInfo.owner?.includes(owner.uid)) {
              return (
                <OwnerWrapper key={owner.uid}>
                  {owner.displayName.charAt(0)}
                </OwnerWrapper>
              );
            }
          })}
      </OwnerContainer>
    );
  };

  useEffect(() => {
    const TimeCheckboxColorHandler = () => {
      if (cardInfo.complete) {
        setTimeLabelColor("rgba(139, 195, 74, 0.5)");
      } else if (!cardInfo.complete && cardInfo.time?.deadline) {
        const curTime = new Date().getTime();
        const newColorCode =
          cardInfo.time.deadline < curTime
            ? "rgba(239, 83, 80, 0.9)"
            : "rgba(253, 216, 53, 0.9)";
        setTimeLabelColor(newColorCode);
      }
    };

    TimeCheckboxColorHandler();
  }, [cardInfo]);

  return (
    <Container
      isDragging={draggingCards?.includes(cardInfo.id) || false}
      onClick={() => {
        navigate(`/project/${id}/card/${cardInfo.id}`);
      }}
    >
      <Wrapper>
        {cardInfo.tagsIDs && tags && tagsCollection()}
        <TitleWrapper>{cardInfo.title}</TitleWrapper>
        {cardInfo.description && <DescriptionIcon />}
        {cardInfo.time?.start && cardInfo.time?.deadline && time()}
        {cardInfo.owner && ownerList()}
      </Wrapper>
    </Container>
  );
};

export default Card;
