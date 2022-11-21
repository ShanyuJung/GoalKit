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
`;

const Member = styled.div<{ colorCode: string }>`
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 30px;
  border-radius: 50%;
  background-color: ${(props) => `${props.colorCode}`};
  text-align: center;
  margin: 0px 1px;
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
          draftState.push(newDoc);
        });
      });
      setMembersInfo(newMembers);
    });

    return () => {
      unsubscribe();
    };
  }, [memberIDs]);

  return (
    <Wrapper>
      <MemberList>
        {membersInfo.length > 0 &&
          membersInfo.map((member, index) => {
            if (member.state === "online" && index < 3) {
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
      </MemberList>
    </Wrapper>
  );
};

export default OnlineMembers;
