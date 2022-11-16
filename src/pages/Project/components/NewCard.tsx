import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../../utils/hooks";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";

const Wrapper = styled.div`
  width: 250px;
`;

const TextArea = styled.textarea<{ isShow: boolean }>`
  width: 100%;
  resize: none;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  padding: 5px 5px;
  font-size: 16px;
  background-color: ${(props) => (props.isShow ? "#fff" : "transparent")};
  border-radius: 5px;
  border-color: ${(props) => (props.isShow ? "#000" : "transparent")};

  &:hover {
    background-color: ${(props) => (props.isShow ? "#fff" : "#ccc")};
  }
`;

const ButtonWrapper = styled.div<{ isShow: boolean }>`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  gap: 10px;
  justify-content: space-between;
`;

const Button = styled.button`
  cursor: pointer;
  color: #fff;
  background-color: #0085d1;
  border: none;
  font-size: 16px;
  border-radius: 5px;
  margin: 0px;
  padding: 5px;
  font-weight: 600;

  &:hover {
    background-color: #0079bf;
  }
`;

const CloseButton = styled(closeIcon)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  path {
    fill: #999;
  }

  &:hover {
    path {
      fill: #555;
    }
  }
`;

interface Props {
  onSubmit: (newCardTitle: string, parentID: string) => void;
  parentID: string;
}

export type Ref = HTMLTextAreaElement;

const NewCard = ({ onSubmit, parentID }: Props) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const ref = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const focusHandler = () => {
    setIsFocus(true);
  };

  const clickOutsideHandler = () => {
    setIsFocus(false);
    textRef.current?.blur();
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!textRef.current?.value) return;
    onSubmit(textRef.current?.value || "", parentID);
    textRef.current!.value = "";
  };

  useOnClickOutside(ref, clickOutsideHandler);

  return (
    <Wrapper onFocus={focusHandler} ref={ref}>
      <form onSubmit={onSubmitHandler}>
        <TextArea
          placeholder="&#43; Add new card"
          ref={textRef}
          isShow={isFocus}
          rows={isFocus ? 2 : 1}
          required
        />
        <ButtonWrapper isShow={isFocus}>
          <Button>Add new card</Button>
          <CloseButton onClick={clickOutsideHandler} />
        </ButtonWrapper>
      </form>
    </Wrapper>
  );
};

export default NewCard;
