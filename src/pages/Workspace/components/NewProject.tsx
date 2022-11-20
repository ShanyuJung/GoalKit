import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../../utils/hooks";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";

const Wrapper = styled.div`
  position: relative;
  z-index: 5;
  width: 240px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.35);
  cursor: pointer;

  &::before {
    content: "";
    background-color: rgba(9, 30, 66, 0.04);
    position: absolute;
    z-index: -1;
    width: 240px;
    height: 100px;
    border-radius: 5px;
  }

  &:hover {
    &::before {
      background-color: rgba(9, 30, 66, 0.1);
    }
  }
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  border-radius: 5px;
  height: 100px;
  line-height: 100px;
  cursor: pointer;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 0px;
  position: relative;
  top: -90px;
  left: 250px;
`;

const Form = styled.form`
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
`;

const FormTitle = styled.div`
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  font-family: "Poppins", sans-serif;
`;

const Button = styled.button`
  color: #fff;
  background-color: #0085d1;
  border: none;
  margin: 10px;
  font-size: 16px;
  width: 100%;
  border-radius: 5px;
  margin: 0;
  padding: 5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

const CloseButton = styled(closeIcon)`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 10px;
  right: 5px;
  cursor: pointer;

  path {
    fill: #ccc;
  }

  &:hover {
    path {
      fill: #555;
    }
  }
`;

interface Props {
  onSubmit: (newWorkspaceTitle: string) => void;
}

const NewProject = ({ onSubmit }: Props) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const ref = useRef(null);
  const [isEdit, setIsEdit] = useState(false);

  useOnClickOutside(ref, () => setIsEdit(false));

  const editHandler = () => {
    setIsEdit((prev) => !prev);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!textRef.current?.value) return;
    onSubmit(textRef.current?.value || "");
    textRef.current!.value = "";
  };

  return (
    <Wrapper ref={ref}>
      <Text onClick={editHandler}>Build New Project Board</Text>
      <FormWrapper>
        {isEdit ? (
          <Form onSubmit={onSubmitHandler}>
            <FormTitle>New Project Board</FormTitle>
            <CloseButton
              onClick={() => {
                setIsEdit(false);
              }}
            />
            <TextArea placeholder="&#43; Add new project" ref={textRef} />
            <Button>Add new project</Button>
          </Form>
        ) : (
          <></>
        )}
      </FormWrapper>
    </Wrapper>
  );
};

export default NewProject;
