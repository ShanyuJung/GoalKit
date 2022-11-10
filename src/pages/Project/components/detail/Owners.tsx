import { useState } from "react";
import styled from "styled-components";

const OwnerContainer = styled.div`
  margin: 10px;
  width: 300px;
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
  padding: 2px 15px;
  border-radius: 5px;
  background-color: #c5cae9;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
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
`;

const OwnerToggleButton = styled.button`
  width: 100px;
  margin-top: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #42a5f5;
  height: 26px;
  line-height: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

const OwnerButtonWrapper = styled.div<{ isToggle: boolean }>`
  display: ${(props) => (props.isToggle ? "flex" : "none")};
  flex-direction: column;
  padding: 5px;
  gap: 5px;
`;

const OwnerButton = styled.button`
  width: 100px;
  background-color: #c5cae9;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

interface Member {
  uid: string;
  email: string;
  displayName: string;
}

interface Props {
  ownerInfo: Member[] | undefined;
  members: Member[] | undefined;
  addOwnerHandler(id: string): void;
}

const Owners: React.FC<Props> = ({ ownerInfo, members, addOwnerHandler }) => {
  const [isToggle, setIsToggle] = useState(false);

  return (
    <OwnerContainer>
      <OwnerTitle>Owner:</OwnerTitle>
      <OwnerList>
        {ownerInfo && ownerInfo.length > 0 ? (
          ownerInfo?.map((owner) => {
            return (
              <OwnerWrapper key={owner.uid}>
                <OwnerPoint />
                <Owner>{owner.displayName}</Owner>
              </OwnerWrapper>
            );
          })
        ) : (
          <></>
        )}
        <OwnerToggleButton
          onClick={() => {
            setIsToggle((prev) => !prev);
          }}
        >
          Add Owner
        </OwnerToggleButton>
      </OwnerList>
      <OwnerButtonWrapper isToggle={isToggle}>
        {members?.map((member) => {
          return (
            <OwnerButton
              key={`newOwner-${member.uid}`}
              onClick={() => {
                addOwnerHandler(member.uid);
              }}
            >
              {member.displayName}
            </OwnerButton>
          );
        })}
      </OwnerButtonWrapper>
    </OwnerContainer>
  );
};

export default Owners;
