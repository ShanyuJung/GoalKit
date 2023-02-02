import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../../utils/hooks";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";
import Swal from "sweetalert2";

const Wrapper = styled.div<{ $isEdit: boolean }>`
  position: relative;
  z-index: 5;
  width: 215px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
  color: #2c4859;
  font-size: 16px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$isEdit ? "rgba(9, 30, 66, 0.1);" : "rgba(9, 30, 66, 0.04)"};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  &:hover {
    color: #1d3240;
    background-color: rgba(9, 30, 66, 0.1);
  }
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  border-radius: 5px;
  height: 100px;
  line-height: 100px;
  cursor: pointer;
  font-size: 16px;
  color: #2c4859;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  position: absolute;
  top: 110px;
  left: 0px;
`;

const Form = styled.form`
  box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.35);
  width: 100%;
  padding: 20px;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  cursor: default;
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
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
  font-family: "Poppins", sans-serif;
  cursor: text;
`;

const Button = styled.button`
  color: #f2f2f2;
  background-color: #658da6;
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
    filter: brightness(110%);
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
  const textRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useOnClickOutside(ref, () => setIsEdit(false));

  const editHandler = () => {
    setIsEdit((prevIsEdit) => !prevIsEdit);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!textRef.current?.value.trim()) {
      Swal.fire(
        "Invalid Project name",
        "Project name must contain at least one characters.",
        "warning"
      );
      return;
    }
    if (textRef.current.value.trim().length > 30) {
      Swal.fire(
        "Invalid project name",
        "Project name must not contain over 30 characters.",
        "warning"
      );
      return;
    }
    onSubmit(textRef.current?.value.trim() || "");
    textRef.current.value = "";
    setIsEdit(false);
  };

  return (
    <Wrapper ref={ref} $isEdit={isEdit}>
      <Text onClick={editHandler}>Create New Project</Text>
      <FormWrapper>
        {isEdit ? (
          <Form onSubmit={onSubmitHandler}>
            <FormTitle>New Project Board</FormTitle>
            <CloseButton
              onClick={() => {
                setIsEdit(false);
              }}
            />
            <TextArea placeholder="  Type project name ..." ref={textRef} />
            <Button>Add New project</Button>
          </Form>
        ) : null}
      </FormWrapper>
    </Wrapper>
  );
};

export default NewProject;
