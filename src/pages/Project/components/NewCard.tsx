import React, { useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  cursor: pointer;
`;

const Button = styled.button<{ isShow: boolean }>`
  display: ${(props) => (props.isShow ? "block" : "none")};
`;

interface Props {
  onSubmit: (newCardTitle: string, parentID: string) => void;
  parentID: string;
}

export type Ref = HTMLTextAreaElement;

const NewCard = ({ onSubmit, parentID }: Props) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocus, setIsFocus] = useState(true);

  const focusHandler = () => {
    // setIsFocus(true);
  };

  const blurHandler = () => {
    // setIsFocus(false);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!textRef.current?.value) return;
    onSubmit(textRef.current?.value || "", parentID);
    textRef.current!.value = "";
  };

  return (
    <Wrapper onFocus={focusHandler} onBlur={blurHandler}>
      <form onSubmit={onSubmitHandler}>
        <TextArea placeholder="&#43; Add new card" ref={textRef} />
        <Button isShow={isFocus}>Add new card</Button>
      </form>
    </Wrapper>
  );
};

export default NewCard;
