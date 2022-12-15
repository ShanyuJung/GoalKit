import { forwardRef } from "react";
import styled from "styled-components";

interface Props {
  labelText: string;
  type: string;
  defaultValue?: string;
}

export type Ref = HTMLInputElement;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 5px 0px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  padding: 0px 5px;
  margin-bottom: 5px;
  color: #1d3240;
  margin-left: 10px;
  position: relative;
  width: fit-content;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const StyledInput = styled.input`
  margin: 0;
  font-size: 24px;
  line-height: 40px;
  height: 40px;
  border-radius: 20px;
  padding: 0px 20px;
  border: 1px solid #ccc;

  @media (max-width: 600px) {
    font-size: 18px;
    line-height: 28px;
    height: 28px;
  }
`;

const AuthInput = forwardRef<Ref, Props>((props, ref) => {
  const { labelText, type, defaultValue } = props;
  return (
    <InputWrapper>
      <InputLabel>{labelText}</InputLabel>
      <StyledInput
        ref={ref}
        type={type}
        required
        autoComplete="off"
        defaultValue={defaultValue}
      />
    </InputWrapper>
  );
});

AuthInput.displayName = "AuthInput";

export default AuthInput;
