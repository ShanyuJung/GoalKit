import { useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as filterIcon } from "../../../assets/filter-svgrepo-com.svg";
import { ReactComponent as closeIcon } from "../../../assets/close-svgrepo-com.svg";
import { useOnClickOutside } from "../../../utils/hooks";

const Container = styled.div`
  height: 40px;
`;

const Wrapper = styled.div<{ $isToggle: boolean; $keyword: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 30px;
  border-radius: 5px;
  margin-top: 5px;
  background-color: ${(props) =>
    props.$isToggle || props.$keyword ? "#ddd" : "transparent"};

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

  @media (max-width: 808px) {
    display: none;
  }
`;

const DropdownWrapper = styled.div<{ $isToggle: boolean }>`
  max-height: ${(props) => (props.$isToggle ? "450px" : "0px")};
  overflow: auto;
  transition: max-height 0.3s ease-in;
  margin-top: 5px;
`;

const DropdownMenuList = styled.div`
  position: absolute;
  z-index: 10;
  background-color: red;

  @media (max-width: 808px) {
    right: 0;
  }
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

const ClearFilterCriteriaButton = styled(closeIcon)`
  position: relative;
  top: 0px;
  right: 3px;
  width: 24px;
  height: 24px;
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

const ClearKeywordButton = styled(closeIcon)`
  position: absolute;
  top: 60px;
  right: 10px;
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

const WarningText = styled.div`
  padding: 5px 10px;
  font-size: 12px;
  color: #e74c3c;
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
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const ref = useRef(null);
  const textRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(ref, () => setIsToggle(false));

  const clearKeywordHandler = () => {
    if (!textRef.current) return;
    setKeyword("");
    textRef.current.value = "";
  };

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
            ref={textRef}
          />
          {keyword && <ClearKeywordButton onClick={clearKeywordHandler} />}
        </DropdownInputWrapper>

        <WarningText>
          Drag and drop feature will not work while filtering cards
        </WarningText>
      </DropdownChildrenWrapper>
    );
  };

  return (
    <Container ref={ref}>
      <Wrapper
        $isToggle={isToggle}
        $keyword={keyword}
        onClick={() => {
          setIsToggle((prevToggle) => !prevToggle);
        }}
      >
        <FilterIcon />
        <FilterTitle>Filter Criteria</FilterTitle>
        {keyword && <ClearFilterCriteriaButton onClick={clearKeywordHandler} />}
      </Wrapper>
      <DropdownWrapper $isToggle={isToggle}>
        {isToggle ? (
          <DropdownMenuList>{dropdownContent()}</DropdownMenuList>
        ) : null}
      </DropdownWrapper>
    </Container>
  );
};

export default CardFilter;
