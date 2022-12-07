import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";

const MessageWrapper = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isCurrentUser ? " row-reverse" : "row")};
  width: 100%;
  align-items: flex-end;
  margin: 10px 0px;
  gap: 10px;
`;

const MessageUserIcon = styled.div<{ isCurrentUser: boolean }>`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  flex-shrink: 0;
  background-color: ${(props) => (props.isCurrentUser ? "#2196f3" : "#81c784")};
`;

const MessageText = styled.div<{ isCurrentUser: boolean }>`
  max-width: 230px;
  position: relative;
  z-index: 1;
  padding: 2px 10px;
  font-size: 16px;
  word-break: break-all;
  word-wrap: break-word;
  border-radius: 5px;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    opacity: 0.6;
    border-radius: 5px;
    background-color: ${(props) => (props.isCurrentUser ? "#2196f3" : "#ccc")};
  }
`;

const Time = styled.div<{ isCurrentUser: boolean }>`
  width: 100%;
  font-size: 8px;
  padding: 0px 40px;
  margin-top: -8px;
  text-align: ${(props) => (props.isCurrentUser ? "right" : "left")};
`;

const MessageUserPhoto = styled.div<{ $background: string }>`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;
`;

interface Props {
  messageUserID: string;
  userFirstChar: string;
  messageText: string;
  messageTime: Timestamp;
  messagePhoto: string;
}

const Message: React.FC<Props> = ({
  messageUserID,
  userFirstChar,
  messageText,
  messageTime,
  messagePhoto,
}) => {
  const [isShowTime, setIsShowTime] = useState(false);
  const { currentUser } = useAuth();

  let newTimeString = "";
  if (messageTime) {
    const newTime = new Date(messageTime.seconds * 1000);
    newTimeString = `${newTime.getFullYear()}/${
      newTime.getMonth() + 1
    }/${newTime.getDate()} ${newTime.getHours()}:${newTime.getMinutes()}`;
  }

  if (!currentUser) return null;

  return (
    <>
      <MessageWrapper
        isCurrentUser={currentUser.uid === messageUserID}
        onClick={() => {
          setIsShowTime((prevIsShowTime) => !prevIsShowTime);
        }}
      >
        {messagePhoto ? (
          <MessageUserPhoto $background={messagePhoto} />
        ) : (
          <MessageUserIcon isCurrentUser={currentUser.uid === messageUserID}>
            {userFirstChar}
          </MessageUserIcon>
        )}
        <MessageText isCurrentUser={currentUser.uid === messageUserID}>
          {`${messageText}`}
        </MessageText>
      </MessageWrapper>
      {messageTime && isShowTime ? (
        <Time isCurrentUser={currentUser.uid === messageUserID}>
          {newTimeString}
        </Time>
      ) : null}
    </>
  );
};

export default Message;
