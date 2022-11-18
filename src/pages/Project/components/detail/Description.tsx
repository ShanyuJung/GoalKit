import { FormEvent, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as descriptionIcon } from "../../../../assets/text-description-svgrepo-com.svg";

const TextAreaWrapper = styled.div`
  margin: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DescriptionIcon = styled(descriptionIcon)`
  height: 20px;
  width: 20px;
  margin-right: 6px;

  path {
    fill: #000;
  }
`;

const DescriptionText = styled.div<{
  backgroundColor: string;
  isEdit: boolean;
}>`
  background-color: ${(props) => props.backgroundColor};
  padding: 5px 10px;
  margin: 5px 0px;
  width: 100%;
  border-radius: 5px;
  display: ${(props) => (props.isEdit ? "none" : "block")};
`;

const TextAreaLabel = styled.label`
  font-size: 16px;
  font-weight: 900;
`;

const EditBlockWrapper = styled.div<{ isEdit: boolean }>`
  display: ${(props) => (props.isEdit ? "block" : "none !important")};
  display: flex;
  flex-direction: column;
  padding: 5px 0px;
`;

const TextArea = styled.textarea`
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  padding: 5px 10px;
  resize: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin: 5px 0px;
  padding: 0px 20px;
`;

const TextAreaButton = styled.button`
  width: 80px;
  width: 80px;
  color: #fff;
  background-color: #0085d1;
  border: none;
  font-size: 16px;
  border-radius: 5px;
  margin: 5px 5px;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

interface Props {
  text: string;
  onSubmit(text: string): void;
}

const Description: React.FC<Props> = ({ text, onSubmit }) => {
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (
      !descriptionRef.current ||
      descriptionRef.current?.value.trim() === text
    ) {
      setIsEdit(false);
      return;
    }
    const newDescription = descriptionRef.current.value.trim();

    onSubmit(newDescription);
    setIsEdit(false);
  };

  return (
    <TextAreaWrapper>
      <Form onSubmit={submitHandler}>
        <TitleWrapper>
          <DescriptionIcon />
          <TextAreaLabel htmlFor="description">Description:</TextAreaLabel>
        </TitleWrapper>
        {text ? (
          <DescriptionText
            backgroundColor="inherit"
            isEdit={isEdit}
            onClick={() => {
              setIsEdit(true);
            }}
          >
            {text}
          </DescriptionText>
        ) : (
          <DescriptionText
            backgroundColor="#CCC"
            isEdit={isEdit}
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Click to add description
          </DescriptionText>
        )}
        <EditBlockWrapper isEdit={isEdit}>
          <TextArea
            id="description"
            name="description"
            defaultValue={text}
            placeholder="Type to add description"
            rows={4}
            ref={descriptionRef}
          />
          <ButtonWrapper>
            <TextAreaButton>save</TextAreaButton>
            <TextAreaButton
              type="button"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              cancel
            </TextAreaButton>
          </ButtonWrapper>
        </EditBlockWrapper>
      </Form>
    </TextAreaWrapper>
  );
};

export default Description;
