import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import produce from "immer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../../firebase";

const Wrapper = styled.div``;

const MemberList = styled.div`
  display: flex;
  margin-right: 5px;
`;

const Member = styled.div<{ colorCode: string; $background?: string }>`
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
`;

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#999"];

interface Props {
  memberIDs: string[];
}

interface Member {
  uid: string;
  email: string;
  displayName: string;
  last_changed?: Timestamp;
  state?: string;
  photoURL?: string;
}

const OnlineMembers: React.FC<Props> = ({ memberIDs }) => {
  const [membersInfo, setMembersInfo] = useState<Member[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id || memberIDs.length < 1) return;
    const colRef = collection(db, "users");
    const q = query(colRef, where("uid", "in", memberIDs));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const emptyArr: Member[] = [];
      const newMembers = produce(emptyArr, (draftState) => {
        snapshot.forEach((doc) => {
          const newDoc = doc.data() as Member;
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
                <Member
                  key={member.uid}
                  colorCode={"#fff"}
                  $background={member.photoURL}
                />
              );
            } else if (member.state === "online" && index < 3) {
              return (
                <Member key={member.uid} colorCode={COLORS[index]}>
                  {member.displayName.charAt(0)}
                </Member>
              );
            } else if (member.state === "online" && index === 3) {
              return (
                <Member key={member.uid} colorCode={COLORS[index]}>
                  {`${membersInfo.length - index}+`}
                </Member>
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
