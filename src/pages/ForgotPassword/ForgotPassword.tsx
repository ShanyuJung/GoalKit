import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import LoginRoute from "../../components/route/LoginRoute";
import { useAuth } from "../../contexts/AuthContext";
import placeholder from "../../assets/forget-password-placeholder.jpg";
import { useProgressiveImage } from "../../utils/hooks";

const Wrapper = styled.div`
  display: flex;
  height: calc(100vh - 70px);
`;

const LandingWrapper = styled.div<{ $url: string | null }>`
  flex-grow: 1;
  background-image: ${(props) =>
    props.$url ? `url(${props.$url})` : `url(${placeholder})`};
  filter: ${(props) => (props.$url ? "blur(0px)" : "blur(4px)")};
  background-size: cover;
  background-position: 0 35%;
  opacity: 0.9;
  background-repeat: no-repeat;
  animation: image-loading 1s;

  @keyframes image-loading {
    0% {
      transform: translateX(-30px);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateX(0px);
      opacity: 1;
    }
  }
`;

const CardWrapper = styled.div`
  overflow-y: scroll;
  padding-top: 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-width: 550px;
  align-items: center;
  animation: card-loading 1s;

  @keyframes card-loading {
    0% {
      transform: translateY(-30px);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const CardTitle = styled.div`
  font-size: 36px;
  color: #1d3240;
  font-weight: 600;
  margin-bottom: 5px;
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
`;

const StyledLink = styled(Link)<{ $fontWeight?: number }>`
  color: #658da6;
  font-size: 14px;
  text-decoration: none;
  font-weight: ${(props) => (props.$fontWeight ? props.$fontWeight : 400)};

  &:hover {
    filter: brightness(110%);
    text-decoration: underline;
  }
`;

const Text = styled.div`
  font-size: 14px;
  margin-top: 10px;
  color: #658da6;
`;

const ErrorMessageWrapper = styled.div`
  border: 1px solid #e74c3c;
  border-radius: 10px;
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

const DescriptionText = styled.div`
  height: 42px;
  line-height: 40px;
  font-size: 16px;
  color: #658da6;
  margin-bottom: 5px;
`;

const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);

  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const email = emailRef.current?.value || "";

    try {
      setErrorMessage("");
      setMessage("");
      setIsLoading(true);
      await resetPassword(email);
      setMessage("Please, check your inbox for password reset letter.");
    } catch {
      setErrorMessage("Failed to reset password.");
    }
    setIsLoading(false);
  };

  const loaded = useProgressiveImage(
    "https://source.unsplash.com/hBuwVLcYTnA/1920x1280"
  );

  return (
    <LoginRoute>
      <Wrapper>
        <LandingWrapper $url={loaded} />
        <CardWrapper>
          <Card>
            <CardTitle>Reset Email</CardTitle>
            {message || errorMessage ? null : (
              <DescriptionText>Request reset password email</DescriptionText>
            )}
            {message !== "" && <MessageWrapper>{message}</MessageWrapper>}
            {errorMessage !== "" && (
              <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
            )}
            <Form onSubmit={submitHandler}>
              <AuthInput labelText="Email" type="email" ref={emailRef} />
              <SubmitButton disabled={isLoading}>Send Reset email</SubmitButton>
            </Form>
            <StyledLink to="/login" $fontWeight={600}>
              Back to Login
            </StyledLink>
          </Card>
          <Text>
            {"Don't have an account? "}
            <StyledLink to="/signup" $fontWeight={600}>
              Signup
            </StyledLink>
          </Text>
        </CardWrapper>
      </Wrapper>
    </LoginRoute>
  );
};

export default ForgotPassword;
