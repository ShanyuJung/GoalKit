import { forwardRef } from "react";
import styled from "styled-components";

interface Props {
  labelText: string;
  type: string;
}

export type Ref = HTMLInputElement;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 10px 0px;
`;

const InputLabel = styled.label`
  font-size: 24px;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  font-size: 20px;
`;

const AuthInput = forwardRef<Ref, Props>((props, ref) => {
  const { labelText, type } = props;
  return (
    <InputWrapper>
      <InputLabel>{labelText}</InputLabel>
      <StyledInput ref={ref} type={type} required autoComplete="off" />
    </InputWrapper>
  );
});

AuthInput.displayName = "AuthInput";

export default AuthInput;
