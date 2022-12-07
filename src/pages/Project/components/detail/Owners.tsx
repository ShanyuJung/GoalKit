import { Timestamp } from "firebase/firestore";
import styled from "styled-components";
import { ReactComponent as closeIcon } from "../../../../assets/close-svgrepo-com.svg";
import { ReactComponent as ownerIcon } from "../../../../assets/user-svgrepo-com.svg";

const OwnerContainer = styled.div`
  margin: 10px;
  width: 300px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const OwnerIcon = styled(ownerIcon)`
  height: 20px;
  width: 20px;
  margin-right: 6px;

  path {
    fill: #444;
  }

  circle {
    fill: #444;
  }
`;

const OwnerTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
`;

const OwnerList = styled.div`
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const OwnerWrapper = styled.div`
  width: fit-content;
  min-width: 100px;
  padding: 2px 0px 2px 15px;
  border-radius: 5px;
  background-color: #c5cae9;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  cursor: default;
`;

const OwnerPoint = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #303f9f;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const RemoveOwnerButton = styled(closeIcon)`
  width: 30px;
  height: 30px;
  cursor: pointer;

  path {
    fill: transparent;
  }

  &:hover {
    path {
      fill: #555;
    }
  }
`;

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

interface Props {
  ownerInfo: Member[];
  removeOwnerHandler(id: string): void;
}

const Owners: React.FC<Props> = ({ ownerInfo, removeOwnerHandler }) => {
  if (ownerInfo?.length === 0) {
    return null;
  }

  return (
    <OwnerContainer>
      <TitleWrapper>
        <OwnerIcon />
        <OwnerTitle>Owner:</OwnerTitle>
      </TitleWrapper>
      <OwnerList>
        {ownerInfo && ownerInfo.length > 0
          ? ownerInfo?.map((owner) => {
              return (
                <OwnerWrapper key={owner.uid}>
                  <OwnerPoint />
                  <Owner>{owner.displayName}</Owner>
                  <RemoveOwnerButton
                    onClick={() => {
                      removeOwnerHandler(owner.uid);
                    }}
                  />
                </OwnerWrapper>
              );
            })
          : null}
      </OwnerList>
    </OwnerContainer>
  );
};

export default Owners;
