import styled from "styled-components";
import { ReactComponent as menuIcon } from "../../../assets/hamburger-menu-more-2-svgrepo-com.svg";

const MenuIcon = styled(menuIcon)`
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 40;
  display: none;

  path {
    fill: #f2f2f2;
  }

  @media (max-width: 808px) {
    display: block;
  }
`;

const ShowSidebarButton = styled.button<{ isShowSidebar: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: #658da6;
  top: 80px;
  left: ${(props) => (props.isShowSidebar ? "245px" : "0px")};
  height: 30px;
  width: 30px;
  background-color: #f2f2f2;
  border-color: #658da6;
  border-radius: 50%;
  cursor: pointer;
  z-index: 40;
  transition: left 0.3s;

  @media (max-width: 808px) {
    top: 15px;
    left: 20px;
    z-index: 30;
    height: 40px;
    width: 40px;
    border-radius: 10px;
    transition: none;

    &::before {
      content: "";
      background-color: ${(props) =>
        props.isShowSidebar ? "#2c4859" : "#658da6"};
      width: 40px;
      height: 40px;
      position: absolute;
      z-index: 40;
      border: 2px solid #658da6;
      box-sizing: border-box;
      border-radius: 10px;
    }

    &:hover {
      &::before {
        background-color: #658da6;
      }
    }
  }
`;

interface Props {
  isShowSidebar: boolean;
  setIsShowSidebar: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const SidebarButton: React.FC<Props> = ({
  isShowSidebar,
  setIsShowSidebar,
}) => {
  return (
    <ShowSidebarButton
      isShowSidebar={isShowSidebar}
      onClick={() => {
        setIsShowSidebar((prevIsShowSidebar) => !prevIsShowSidebar);
      }}
    >
      {isShowSidebar ? "<" : ">"}
      <MenuIcon />
    </ShowSidebarButton>
  );
};

export default SidebarButton;
