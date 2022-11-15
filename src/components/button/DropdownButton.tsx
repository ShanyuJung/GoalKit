import { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../utils/hooks";

const ButtonListItem = styled.div`
  height: 30px;
`;

const CardFeatureButton = styled.button<{ isToggle: boolean }>`
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 5px 10px;
  border: none;
  color: ${(props) => (props.isToggle ? "#111" : "#666")};
  background-color: ${(props) => (props.isToggle ? "#ccc" : "#ddd")};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

const DropdownWrapper = styled.div<{ isToggle: boolean }>`
  max-height: ${(props) => (props.isToggle ? "500px" : "0px")};
  overflow: scroll;
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
}

const DropdownButton: React.FC<Props> = ({ logo, text, children }) => {
  const [isToggle, setIsToggle] = useState(false);
  const ref = useRef(null);

  const toggleHandler = () => {
    setIsToggle((prev) => !prev);
  };

  useOnClickOutside(ref, () => setIsToggle(false));

  return (
    <ButtonListItem ref={ref}>
      <CardFeatureButton onClick={toggleHandler} isToggle={isToggle}>
        {logo}
        {text}
      </CardFeatureButton>
      <DropdownWrapper isToggle={isToggle}>
        {isToggle ? <DropdownMenuList>{children}</DropdownMenuList> : <></>}
      </DropdownWrapper>
    </ButtonListItem>
  );
};

export default DropdownButton;
