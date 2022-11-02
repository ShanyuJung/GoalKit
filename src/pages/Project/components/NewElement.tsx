import React, { forwardRef, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const TextArea = styled.textarea`
  resize: none;
  cursor: pointer;
`;

const Button = styled.button<{ isShow: boolean }>`
  display: ${(props) => (props.isShow ? "block" : "none")};
`;

interface Props {
  onSubmit: (params: string) => void;
  placeholder: string;
  buttonText: string;
}

export type Ref = HTMLTextAreaElement;

const NewElement = ({ onSubmit, placeholder, buttonText }: Props) => {
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
    onSubmit(textRef.current?.value || "");
    textRef.current!.value = "";
  };

  return (
    <Wrapper onFocus={focusHandler} onBlur={blurHandler}>
      <form onSubmit={onSubmitHandler}>
        <TextArea placeholder={placeholder} ref={textRef} />
        <Button isShow={isFocus}>{buttonText}</Button>
      </form>
    </Wrapper>
  );
};

export default NewElement;
