import { useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as filterIcon } from "../../../assets/filter-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";
import { useOnClickOutside } from "../../../utils/hooks";

const Container = styled.div`
  height: 40px;
`;

const Wrapper = styled.div<{ $isToggle: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 30px;
  border-radius: 5px;
  margin-top: 5px;
  background-color: ${(props) => (props.$isToggle ? "#ddd" : "transparent")};

  &:hover {
    background-color: #ddd;
  }
`;

const FilterIcon = styled(filterIcon)`
  width: 18px;
  height: 18px;
  margin: 0px 5px;
`;

const FilterTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin: 0px 5px;
`;

const DropdownWrapper = styled.div<{ $isToggle: boolean }>`
  max-height: ${(props) => (props.$isToggle ? "450px" : "0px")};
  overflow: scroll;
  transition: max-height 0.3s ease-in;
  margin-top: 5px;
`;

const DropdownMenuList = styled.div`
  position: absolute;
  z-index: 10;
  background-color: red;
`;

const DropdownChildrenWrapper = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
  background-color: #ddd;
`;

const DropdownTitle = styled.div`
  text-align: center;
  margin: 0px 5px;
  border-bottom: 1px #999 solid;
`;

const CloseButton = styled(closeIcon)`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  cursor: pointer;

  path {
    fill: #777;
  }

  &:hover {
    path {
      fill: #333;
    }
  }
`;

const DropdownInputWrapper = styled.div`
  padding: 5px 10px;
`;

const DropdownInputLabel = styled.label`
  font-size: 14px;
`;

const DropdownInput = styled.input`
  margin: 0px;
  width: 100%;
`;

interface Props {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const CardFilter: React.FC<Props> = ({ keyword, setKeyword }) => {
  const [isToggle, setIsToggle] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setIsToggle(false));

  const dropdownContent = () => {
    return (
      <DropdownChildrenWrapper>
        <DropdownTitle>Filter Criteria</DropdownTitle>
        <CloseButton
          onClick={() => {
            setIsToggle(false);
          }}
        />
        <DropdownInputWrapper>
          <DropdownInputLabel>Key word</DropdownInputLabel>
          <DropdownInput
            type="text"
            defaultValue={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </DropdownInputWrapper>
      </DropdownChildrenWrapper>
    );
  };

  return (
    <Container ref={ref}>
      <Wrapper
        $isToggle={isToggle}
        onClick={() => {
          setIsToggle((prev) => !prev);
        }}
      >
        <FilterIcon />
        <FilterTitle>Filter Criteria</FilterTitle>
      </Wrapper>
      <DropdownWrapper $isToggle={isToggle}>
        {isToggle ? (
          <DropdownMenuList>{dropdownContent()}</DropdownMenuList>
        ) : (
          <></>
        )}
      </DropdownWrapper>
    </Container>
  );
};

export default CardFilter;
