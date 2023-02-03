import React, { useRef, useState } from "react";
import { useOnClickOutside } from "../../../utils/hooks";
import styled from "styled-components";
import Swal from "sweetalert2";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";

const Wrapper = styled.div`
  width: 250px;
`;

const TextArea = styled.textarea<{ isFocused: boolean }>`
  width: 100%;
  resize: none;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  padding: 5px 5px;
  font-size: 16px;
  background-color: ${(props) => (props.isFocused ? "#fff" : "transparent")};
  border-radius: 5px;
  border-color: ${(props) => (props.isFocused ? "#000" : "transparent")};
  overflow: hidden;

  &:hover {
    background-color: ${(props) => (props.isFocused ? "#fff" : "#ccc")};
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

const NewCard = ({ onSubmit, parentID }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef(null);
  const [isTextAreaFocus, setIsTextAreaFocus] = useState<boolean>(false);

  const focusHandler = () => {
    setIsTextAreaFocus(true);
  };

  const clickOutsideHandler = () => {
    if (!textRef.current) return;
    setIsTextAreaFocus(false);
    textRef.current?.blur();
    textRef.current.value = "";
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!textRef.current?.value.trim()) {
      Swal.fire(
        "Invalid card name",
        "Card name must contain at least one characters.",
        "warning"
      );
      return;
    }
    if (textRef.current.value.trim().length > 50) {
      Swal.fire(
        "Invalid card name",
        "Card name must not contain over 50 characters.",
        "warning"
      );
      return;
    }
    onSubmit(textRef.current?.value.trim() || "", parentID);
    textRef.current.value = "";
  };

  useOnClickOutside(ref, clickOutsideHandler);

  return (
    <Wrapper onFocus={focusHandler} ref={ref}>
      <form onSubmit={onSubmitHandler}>
        <TextArea
          placeholder="&#43; Add new card"
          ref={textRef}
          isFocused={isTextAreaFocus}
          rows={isTextAreaFocus ? 2 : 1}
          required
        />
        <ButtonWrapper isShow={isTextAreaFocus}>
          <Button>Add New card</Button>
          <CloseButton onClick={clickOutsideHandler} />
        </ButtonWrapper>
      </form>
    </Wrapper>
  );
};

export default NewCard;
