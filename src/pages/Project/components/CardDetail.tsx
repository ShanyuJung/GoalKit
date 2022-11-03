import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  margin: 10px;
`;

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const TextAreaLabel = styled.label``;

const TextArea = styled.textarea``;

const TextAreaButton = styled.button``;

const TimeWrapper = styled.div`
  margin: 10px;
`;

const TimeInputWrapper = styled.div`
  margin: 10px;
`;

const TimeInputLabel = styled.label``;

const TimeInput = styled.input``;

const TimeCheckboxWrapper = styled.div`
  margin: 10px;
`;

const TimeCheckbox = styled.input``;

const TimeCheckboxLabel = styled.label``;

const TimeButton = styled.button``;

interface CardInterface {
  title: string;
  id: string;
  time?: { start?: number; deadline: number };
  description?: string;
  owner?: string;
  tags?: string[];
}
interface ListInterface {
  id: string;
  title: string;
  cards: CardInterface[];
}

interface Props {
  listsArray: ListInterface[];
}

const CardDetail: React.FC<Props> = ({ listsArray }) => {
  const [curCard, setCurCard] = useState<CardInterface | undefined>(undefined);
  const { cardId } = useParams();

  useEffect(() => {
    if (!cardId || listsArray.length === 0) return;
    const [newList] = listsArray.filter((list) => {
      return list.cards.some((card) => {
        return card.id === cardId;
      });
    });
    const [newCard] = newList.cards.filter((card) => {
      return card.id === cardId;
    });

    setCurCard(newCard);
  }, [listsArray, cardId]);

  console.log(curCard);

  const cardInfo = () => {
    if (!curCard) return;

    return (
      <>
        <TitleInput type="text" defaultValue={curCard.title} disabled={true} />
        <TextAreaWrapper>
          <TextAreaLabel htmlFor="description">Description</TextAreaLabel>
          <TextArea
            id="description"
            name="description"
            defaultValue={curCard.description}
          />
          <TextAreaButton>save</TextAreaButton>
        </TextAreaWrapper>
        <TimeWrapper>
          {curCard.time?.deadline && (
            <TimeCheckboxWrapper>
              <TimeCheckbox type="checkbox" />
              <TimeCheckboxLabel>{curCard.time.deadline}</TimeCheckboxLabel>
            </TimeCheckboxWrapper>
          )}
          <TimeInputWrapper>
            <TimeInputLabel>Start from:</TimeInputLabel>
            <TimeInput type="datetime-local" />
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInputLabel>Deadline :</TimeInputLabel>
            <TimeInput type="datetime-local" />
          </TimeInputWrapper>
        </TimeWrapper>
      </>
    );
  };

  return <Wrapper>{cardInfo()}</Wrapper>;
};

export default CardDetail;
