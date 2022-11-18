import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as descriptionIcon } from "../../../assets/text-description-svgrepo-com.svg";
import { ReactComponent as todoIcon } from "../../../assets/checkbox-svgrepo-com.svg";

interface IsDraggingProps {
  isDragging: boolean;
}

const Container = styled.div<IsDraggingProps>`
  width: 260px;
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

const TitleWrapper = styled.div`
  margin: 5px 0px;
  font-size: 16px;
  font-weight: 600;
`;

const DescriptionIcon = styled(descriptionIcon)`
  width: 16px;
  height: 16px;
  margin: 5px 0px;
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
  margin: 5px 0px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
  margin: 5px 0px;
`;

const TagWrapper = styled.div<{ colorCode: string }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: fit-content;
  min-width: 60px;
  max-width: 220px;
  height: 16px;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;

  &::before {
    position: absolute;
    content: "";
    left: 0px;
    width: 100%;
    border-radius: 5px;
    height: 16px;
    background-color: ${(props) => props.colorCode};
    z-index: -1;
    opacity: 0.4;
  }

  &:hover {
    &::before {
      opacity: 0.7;
    }
  }
`;

const TagPoint = styled.div<{ colorCode: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.colorCode};
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
  margin-bottom: 5px;
`;

const OwnerWrapper = styled.div`
  background-color: #c5cae9;
  padding: 5px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConditionWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ConditionGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 8px;
`;

const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const TodoIcon = styled(todoIcon)<{ $isAllDone: boolean }>`
  width: 12px;
  height: 12px;
  margin: 5px 0px;
  path {
    fill: ${(props) => (props.$isAllDone ? "#008000" : "#828282")};
  }
`;

const TodoText = styled.div<{ $isAllDone: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.$isAllDone ? "#008000" : "#828282")};
`;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline?: number };
  description?: string;
  owner?: string[];
  tagsIDs?: string[];
  complete?: boolean;
  todo?: { title: string; isDone: boolean; id: string }[];
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
    if (!cardInfo.tagsIDs || cardInfo.tagsIDs.length === 0) {
      return <></>;
    }

    return (
      <TagsContainer>
        {cardInfo.tagsIDs &&
          tags &&
          tags.map((tag) => {
            if (cardInfo.tagsIDs?.includes(tag.id)) {
              return (
                <TagWrapper key={tag.id} colorCode={tag.colorCode}>
                  <TagPoint colorCode={tag.colorCode} />
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

  const todoList = () => {
    if (!cardInfo.todo || cardInfo.todo?.length === 0) {
      return <></>;
    }
    const total = cardInfo.todo.length;
    let done = 0;
    cardInfo.todo.forEach((task) => {
      if (task.isDone) {
        done += 1;
      }
    });

    return (
      <TodoWrapper>
        <TodoIcon $isAllDone={total === done} />
        <TodoText $isAllDone={total === done}>{`${done}/${total}`}</TodoText>
      </TodoWrapper>
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
        <ConditionWrapper>
          <ConditionGroupWrapper>
            {cardInfo.time?.start && cardInfo.time?.deadline && time()}
            {cardInfo.description && <DescriptionIcon />}
            {cardInfo.todo && todoList()}
          </ConditionGroupWrapper>
          {cardInfo.owner && ownerList()}
        </ConditionWrapper>
      </Wrapper>
    </Container>
  );
};

export default Card;
