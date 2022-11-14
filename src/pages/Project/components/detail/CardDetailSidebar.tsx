import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as TrashIcon } from "../../../../assets/trash-svgrepo-com.svg";

const Wrapper = styled.div`
  width: 250px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const ListTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #666;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TrashLogo = styled(TrashIcon)`
  height: 16px;
  margin-right: 10px;

  path {
    fill: #777;
  }
`;

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

  &:hover {
    color: #111;
    background-color: #ccc;
  }
`;

interface Props {
  onDelete: (targetCardID: string) => void;
}

const CardDetailSideBar: React.FC<Props> = ({ onDelete }) => {
  const { id, cardId } = useParams();
  const navigate = useNavigate();

  const checkDeleteCardHandler = () => {
    const r = window.confirm("Check to delete selected card");
    if (r === true) {
      navigate(`/project/${id}`);
      onDelete(cardId || "");
    }
  };

  return (
    <Wrapper>
      <ListTitle>Edit Card</ListTitle>
      <ButtonList>
        <ButtonListItem>
          <CardFeatureButton onClick={checkDeleteCardHandler}>
            <TrashLogo />
            Delete Card
          </CardFeatureButton>
        </ButtonListItem>
      </ButtonList>
    </Wrapper>
  );
};

export default CardDetailSideBar;
