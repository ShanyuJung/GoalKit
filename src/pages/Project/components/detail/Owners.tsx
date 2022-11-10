import styled from "styled-components";

const OwnerContainer = styled.div``;

const OwnerList = styled.div``;

const OwnerWrapper = styled.div``;

const OwnerButtonWrapper = styled.div``;

const OwnerButton = styled.button``;

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
  return (
    <OwnerContainer>
      <OwnerList>
        {ownerInfo &&
          ownerInfo?.map((owner) => {
            return (
              <OwnerWrapper key={owner.uid}>{owner.displayName}</OwnerWrapper>
            );
          })}
      </OwnerList>
      <OwnerButtonWrapper>
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
