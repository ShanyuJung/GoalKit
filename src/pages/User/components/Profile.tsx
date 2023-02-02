import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref,
  list,
} from "firebase/storage";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ReactComponent as editIcon } from "../../../assets/edit-svgrepo-com.svg";
import AuthInput from "../../../components/input/AuthInput";
import ReactLoading from "react-loading";

const Wrapper = styled.div`
  padding: 50px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 360px;
`;

const Card = styled.div`
  min-width: 450px;
  padding: 20px;
  border: 1px #658da647 solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;

  @media (max-width: 500px) {
    width: 90%;
  }
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
  background-color: #658da6;
  border: none;
  margin: 20px;
  border-radius: 5px;
  padding: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(110%);
  }

  @media (max-width: 500px) {
    font-size: 16px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Image = styled.div<{ $background: string }>`
  width: 150px;
  height: 150px;
  font-size: 48px;
  border-radius: 50%;
  border: 4px solid #658da6;
  overflow: hidden;
  background-image: ${(props) => `url(${props.$background})`};
  background-size: cover;
  margin-bottom: 20px;
`;

const DefaultImage = styled.div`
  width: 150px;
  height: 150px;
  font-size: 48px;
  border-radius: 50%;
  background-color: #658da6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileTextWrapper = styled.div`
  display: flex;
  width: 80%;
  align-items: flex-end;
  min-height: 35px;
  overflow: hidden;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EditTitle = styled.div`
  color: #1d3240;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 5px;

  @media (max-width: 500px) {
    font-size: 24px;
  }
`;

const ProfileTitle = styled.div`
  width: 18%;
  font-size: 18px;
  margin-right: 5px;
  flex-shrink: 0;
  color: #2c4859;
  line-height: 27px;

  @media (max-width: 500px) {
    font-size: 16px;
  }
`;

const ProfileText = styled.div`
  font-size: 24px;
  color: #1d3240;
  line-height: 30px;
  font-weight: 600;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 500px) {
    font-size: 18px;
    padding-left: 30px;
  }
`;

const EndEdit = styled.div`
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  color: #658da6;
  font-weight: 600;

  &:hover {
    color: #1d3240;
    text-decoration: underline 2px;
    opacity: 0.7;
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
  top: -65px;
  right: -85px;
`;

const EditIcon = styled(editIcon)`
  width: 36px;
  height: 36px;
  opacity: 0.4;
  cursor: pointer;
  path {
    fill: #2c4859;
  }

  &:hover {
    opacity: 0.7;
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
  margin-bottom: 5px;
  filter: brightness(110%);
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
  margin-bottom: 5px;
  filter: brightness(110%);
`;

const Loading = styled(ReactLoading)`
  margin: auto;
`;

const Profile = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { currentUser, updatePhotoURL, updateUserDisplayName } = useAuth();

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    if (!nameRef.current?.value.trim()) {
      setErrorMessage("Can not enter empty name.");
      return;
    }

    if (
      currentUser &&
      nameRef.current.value.trim() === currentUser.displayName
    ) {
      setErrorMessage("New name is same to previous one.");
      return;
    }

    const newName = nameRef.current.value.trim();
    setMessage("");
    setErrorMessage("");
    setIsLoading(true);
    try {
      await updateUserDisplayName(newName);
      setMessage("Update user name succeed.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch {
      setErrorMessage("Fail to update user name.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const uploadUserPhotoHandler = async () => {
      if (imageUpload === null) return;
      if (imageUpload.size > 2097152) {
        return setErrorMessage("Maximum size of photo is 2MB.");
      }

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

      setIsLoading(true);
      setMessage("");
      setErrorMessage("");
      try {
        await uploadUserPhoto(imageUpload);
        setMessage("Update user photo succeed.");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch {
        setErrorMessage("Fail to upload image.");
      }
      setIsLoading(false);
    };

    uploadUserPhotoHandler();
  }, [imageUpload]);

  const renderUserIcon = () => {
    return (
      <>
        {currentUser && currentUser.photoURL ? (
          <Image $background={currentUser.photoURL} />
        ) : (
          <DefaultImage>
            {currentUser ? currentUser.displayName.charAt(0) : ""}
          </DefaultImage>
        )}
      </>
    );
  };

  const renderProfileCard = () => {
    return (
      <>
        <ImageWrapper>
          {isLoading && (
            <DefaultImage>
              <Loading />
            </DefaultImage>
          )}
          {!isLoading && renderUserIcon()}
          <ImageInputWrapper>
            <ImageInputLabel>
              <ImageInput
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
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
          <ProfileText>{currentUser && currentUser.displayName}</ProfileText>
        </ProfileTextWrapper>
        <ProfileTextWrapper>
          <ProfileTitle>Email:</ProfileTitle>
          <ProfileText>{currentUser && currentUser.email}</ProfileText>
        </ProfileTextWrapper>
        <SubmitButton
          disabled={isLoading}
          onClick={() => {
            setMessage("");
            setErrorMessage("");
            setIsEdit(true);
          }}
        >
          Edit Profile
        </SubmitButton>
      </>
    );
  };

  const renderEditBoard = () => {
    return (
      <Form onSubmit={onSubmitHandler}>
        <AuthInput
          labelText="Name"
          type="text"
          defaultValue={currentUser ? currentUser.displayName : ""}
          ref={nameRef}
        />
        <SubmitButton>Update Profile</SubmitButton>
      </Form>
    );
  };

  return (
    <Wrapper>
      <Card>
        <EditTitle>Update Profile</EditTitle>
        {message === "" ? null : <MessageWrapper>{message}</MessageWrapper>}
        {errorMessage === "" ? null : (
          <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
        )}
        {isEdit ? renderEditBoard() : renderProfileCard()}
      </Card>
      {isEdit ? (
        <EndEdit
          onClick={() => {
            if (isLoading) return;
            setMessage("");
            setErrorMessage("");
            setIsEdit(false);
          }}
        >
          Back to Dashboard
        </EndEdit>
      ) : null}
    </Wrapper>
  );
};

export default Profile;
