import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import styled from "styled-components";
import produce from "immer";
import { MemberInterface } from "../../../types";

const Wrapper = styled.div``;

const MemberList = styled.div`
  display: flex;
  margin-right: 5px;
`;

const MemberWrapper = styled.div<{ colorCode: string; $background?: string }>`
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  border-radius: 50%;
  background-color: ${(props) => `${props.colorCode}`};
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;
  text-align: center;
  margin: 0px 1px;
  margin-right: -5px;
  outline: 2px solid #fff;
  cursor: default;

  @media (max-width: 808px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
    line-height: 24px;
  }
`;

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#999"];

interface Props {
  memberIDs: string[];
}

const OnlineMembers: React.FC<Props> = ({ memberIDs }) => {
  const [membersInfo, setMembersInfo] = useState<MemberInterface[]>([]);
  const { projectID } = useParams();

  useEffect(() => {
    if (!projectID || memberIDs.length < 1) return;
    const colRef = collection(db, "users");
    const q = query(colRef, where("uid", "in", memberIDs));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const emptyArr: MemberInterface[] = [];
      const newMembers = produce(emptyArr, (draftState) => {
        snapshot.forEach((doc) => {
          const newDoc = doc.data() as MemberInterface;
          if (newDoc.state === "online") {
            draftState.push(newDoc);
          }
        });
      });
      setMembersInfo(newMembers);
    });

    return () => {
      unsubscribe();
    };
  }, [memberIDs]);

  const renderMemberIcon = () => {
    return (
      <>
        {membersInfo.length > 0 &&
          membersInfo.map((member, index) => {
            if (member.state === "online" && index < 3 && member.photoURL) {
              return (
                <MemberWrapper
                  key={member.uid}
                  colorCode={"#fff"}
                  $background={member.photoURL}
                />
              );
            } else if (member.state === "online" && index < 3) {
              return (
                <MemberWrapper key={member.uid} colorCode={COLORS[index]}>
                  {member.displayName.charAt(0)}
                </MemberWrapper>
              );
            } else if (member.state === "online" && index === 3) {
              return (
                <MemberWrapper key={member.uid} colorCode={COLORS[index]}>
                  {`${membersInfo.length - index}+`}
                </MemberWrapper>
              );
            }
          })}
      </>
    );
  };

  return (
    <Wrapper>
      <MemberList>{renderMemberIcon()}</MemberList>
    </Wrapper>
  );
};

export default OnlineMembers;
