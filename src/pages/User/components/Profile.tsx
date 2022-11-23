import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref,
  list,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { ReactComponent as editIcon } from "../../../assets/edit-svgrepo-com.svg";
import AuthInput from "../../../components/input/AuthInput";

const Wrapper = styled.div`
  padding: 100px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  width: 450px;
  padding: 20px;
  border: 1px #ccc solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  width: 80%;
  font-size: 20px;
  color: #fff;
  border: none;
  background-color: #0085d1;
  border: none;
  margin: 20px;
  border-radius: 5px;
  padding: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0079bf;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Image = styled.div<{ $background: string }>`
  width: 100px;
  height: 100px;
  font-size: 48px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;
  margin-bottom: 20px;
`;

const DefaultImage = styled.div`
  width: 100px;
  height: 100px;
  font-size: 48px;
  border-radius: 50%;
  background-color: #0085d1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileTextWrapper = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
`;

const ProfileTitle = styled.div`
  width: 25%;
  font-size: 24px;
  flex-shrink: 0;
`;

const ProfileText = styled.div`
  font-size: 24px;
`;

const EndEdit = styled.div`
  color: #0d6efd;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageInputWrapper = styled.div`
  height: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageInputLabel = styled.label`
  position: relative;
  top: -45px;
  right: -40px;
`;

const EditIcon = styled(editIcon)`
  width: 20px;
  height: 20px;
  opacity: 0.5;
  path {
    fill: #ccc;
  }

  &:hover {
    opacity: 1;
  }
`;

const ErrorMessageWrapper = styled.div`
  border: 1px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
  width: 80%;
  text-align: center;
  font-size: 16px;
  min-height: 40px;
  line-height: 40px;
  background-color: #fadbd8;
`;

const MessageWrapper = styled.div`
  border: 1px solid #196f3d;
  border-radius: 5px;
  color: #196f3d;
  width: 80%;
  text-align: center;
  font-size: 16px;
  min-height: 40px;
  line-height: 40px;
  background-color: #d5f5e3;
`;

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const { currentUser, updatePhotoURL } = useAuth();

  const onSubmitHandler = () => {};

  useEffect(() => {
    const uploadUserPhoto = async (userPhoto: File) => {
      if (!userPhoto || !currentUser) return;
      const authUID = currentUser.uid;
      const storage = getStorage();
      const imageRef = ref(storage, `users/${authUID}/userPhoto`);
      await uploadBytes(imageRef, userPhoto);
      const pathRef = ref(storage, `users/${authUID}`);
      const hasPhoto = await list(pathRef, { maxResults: 1 });
      if (hasPhoto.items.length === 0) return;
      const result = await getDownloadURL(imageRef);
      await updatePhotoURL(result);
      setImageUpload(null);
    };

    if (imageUpload === null) return;
    setIsLoading(true);
    try {
      uploadUserPhoto(imageUpload);
      setMessage("Update user photo succeed.");
    } catch {
      setErrorMessage("Fail to upload image.");
    }
    setIsLoading(false);
  }, [imageUpload]);

  const profileCard = () => {
    return (
      <>
        <ImageWrapper>
          {currentUser.photoURL ? (
            <Image $background={currentUser.photoURL} />
          ) : (
            <DefaultImage>{currentUser.displayName.charAt()}</DefaultImage>
          )}
          <ImageInputWrapper>
            <ImageInputLabel>
              <ImageInput
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(event) => {
                  if (!event.target.files) return;
                  setImageUpload(event.target.files[0]);
                }}
                disabled={isLoading}
              />
              <EditIcon />
            </ImageInputLabel>
          </ImageInputWrapper>
        </ImageWrapper>
        <ProfileTextWrapper>
          <ProfileTitle>Name:</ProfileTitle>
          <ProfileText>{currentUser.displayName}</ProfileText>
        </ProfileTextWrapper>
        <ProfileTextWrapper>
          <ProfileTitle>Email:</ProfileTitle>
          <ProfileText>{currentUser.email}</ProfileText>
        </ProfileTextWrapper>
        <SubmitButton
          onClick={() => {
            setIsEdit(true);
          }}
        >
          Edit Profile
        </SubmitButton>
      </>
    );
  };

  const editBoard = () => {
    return (
      <Form onSubmit={onSubmitHandler}>
        <AuthInput labelText="Name" type="text" />
        <SubmitButton>Update Profile</SubmitButton>
      </Form>
    );
  };

  return (
    <Wrapper>
      <Card>
        {message === "" ? <></> : <MessageWrapper>{message}</MessageWrapper>}
        {errorMessage === "" ? (
          <></>
        ) : (
          <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
        )}
        {isEdit ? editBoard() : profileCard()}
      </Card>
      {isEdit ? (
        <EndEdit
          onClick={() => {
            setIsEdit(false);
          }}
        >
          Back to Dashboard
        </EndEdit>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default Profile;
