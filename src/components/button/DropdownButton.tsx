import { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../utils/hooks";

const ButtonListItem = styled.div`
  height: 30px;
`;

const CardFeatureButton = styled.button`
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 5px 10px;
  border: none;
  color: #666;
  background-color: #ddd;
  cursor: pointer;

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

const DropdownWrapper = styled.div<{ isToggle: boolean }>`
  max-height: ${(props) => (props.isToggle ? "500px" : "0px")};
  overflow: hidden;
  transition: max-height 0.3s ease-in;
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
  const btnRef = useRef(null);

  const toggleHandler = () => {
    setIsToggle((prev) => !prev);
  };

  useOnClickOutside(ref, () => setIsToggle(false), btnRef);

  return (
    <ButtonListItem>
      <CardFeatureButton onClick={toggleHandler} ref={btnRef}>
        {logo}
        {text}
      </CardFeatureButton>
      <DropdownWrapper isToggle={isToggle} ref={ref}>
        {isToggle ? <DropdownMenuList>{children}</DropdownMenuList> : <></>}
      </DropdownWrapper>
    </ButtonListItem>
  );
};

export default DropdownButton;
