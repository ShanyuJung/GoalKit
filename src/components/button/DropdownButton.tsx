import { useRef, useState } from "react";
import { useOnClickOutside } from "../../utils/hooks";
import styled from "styled-components";

const ButtonListItem = styled.div`
  height: 30px;
`;

const CardFeatureButton = styled.button<{
  isToggle: boolean;
  $fontSize: number | undefined;
}>`
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.$fontSize ? `${props.$fontSize}px` : "16px")};
  padding: 5px 10px;
  border: none;
  color: ${(props) => (props.isToggle ? "#111" : "#666")};
  background-color: ${(props) => (props.isToggle ? "#ccc" : "#ddd")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

const DropdownWrapper = styled.div<{ isToggle: boolean }>`
  max-height: ${(props) => (props.isToggle ? "450px" : "0px")};
  overflow: auto;
  transition: max-height 0.3s ease-in;
  margin-top: 5px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
`;

const DropdownMenuList = styled.div`
  position: relative;
  z-index: 10;
`;

interface Props {
  logo: JSX.Element;
  text: string;
  children: React.ReactNode;
  fontSize?: number;
  isDisabled?: boolean;
}

const DropdownButton: React.FC<Props> = ({
  logo,
  text,
  children,
  fontSize,
  isDisabled,
}) => {
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const ref = useRef(null);

  const toggleHandler = () => {
    setIsToggle((prevToggle) => !prevToggle);
  };

  useOnClickOutside(ref, () => setIsToggle(false));

  return (
    <ButtonListItem ref={ref}>
      <CardFeatureButton
        onClick={toggleHandler}
        isToggle={isToggle}
        $fontSize={fontSize}
        disabled={isDisabled}
      >
        {logo}
        {text}
      </CardFeatureButton>
      <DropdownWrapper isToggle={isToggle}>
        {isToggle ? <DropdownMenuList>{children}</DropdownMenuList> : null}
      </DropdownWrapper>
    </ButtonListItem>
  );
};

export default DropdownButton;
