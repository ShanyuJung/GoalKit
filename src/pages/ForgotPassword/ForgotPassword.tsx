import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import { LoginRoute } from "../../components/route/PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";
import placeholder from "../../assets/forget-password-placeholder.jpg";
import { useProgressiveImage } from "../../utils/hooks";

const Wrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  min-width: 360px;
  overflow-y: auto;

  @media (max-width: 799px) {
    padding-bottom: 20px;
    justify-content: center;
  }
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

  &::before {
    content: "";
    position: fixed;
    z-index: 10;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #2c4859;
    background: linear-gradient(#1d3240, #658da6, #000);
    mix-blend-mode: multiply;
    opacity: 0.5;
  }

  @media (max-width: 799px) {
    position: fixed;
    width: 100vw;
    height: calc(100vh - 70px);
    z-index: -1;
    min-width: 360px;
  }

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
  overflow-y: auto;
  padding-top: 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-width: 550px;
  align-items: center;
  justify-content: center;
  animation: card-loading 1s;

  @media (max-width: 600px) {
    min-width: auto;
  }

  @media (min-width: 1280px) {
    min-width: calc(100vw / 1280 * 550);
  }

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

  @media (max-width: 600px) {
    font-size: 30px;
  }
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
  margin-top: -70px;

  background-color: #f2f2f2;

  @media (max-width: 600px) {
    width: 90vw;
  }

  @media (min-width: 1280px) {
    width: 36vw;
    max-width: 600px;
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

  @media (max-width: 600px) {
    font-size: 18px;
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

const LandingTextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 799px) {
    display: none;
  }
`;

const LandingText = styled.div`
  font-size: 5rem;
  font-weight: 700;
  line-height: 5.5rem;
  color: #f2f2f2;
  width: 90%;
  max-width: 700px;
  text-align: center;
  margin-bottom: 15px;
  animation: text-loading 1s;
  position: relative;
  z-index: 20;
  text-shadow: #1d3240 1px 0 5px;

  @media (max-width: 1200px) {
    width: 70%;
    font-size: 3rem;
    line-height: 3.5rem;
  }

  @media (max-width: 950px) {
    width: 80%;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  @keyframes text-loading {
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

const LandingDescription = styled.div`
  font-size: 2.5rem;
  line-height: 3.3rem;
  font-weight: 600;
  color: #f2dac4;
  width: 80%;
  max-width: 700px;
  text-align: center;
  margin-bottom: 10px;
  animation: text-description-loading 1s;
  position: relative;
  z-index: 20;

  @media (max-width: 1200px) {
    width: 70%;
    font-size: 1.8rem;
    line-height: 2.5rem;
  }

  @media (max-width: 950px) {
    width: 70%;
    font-size: 1.5rem;
    line-height: 2rem;
  }

  @keyframes text-description-loading {
    0% {
      transform: translateY(-30px);
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);

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
        <LandingWrapper $url={loaded}>
          <LandingTextWrapper>
            <LandingText>
              GoalKit brings all your tasks, teammates, and tools together
            </LandingText>
            <LandingDescription>
              Keep everything in the same place—even if your team isn’t.
            </LandingDescription>
          </LandingTextWrapper>
        </LandingWrapper>
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
            <Text>
              {"Don't have an account? "}
              <StyledLink to="/signup" $fontWeight={600}>
                Signup
              </StyledLink>
            </Text>
          </Card>
        </CardWrapper>
      </Wrapper>
    </LoginRoute>
  );
};

export default ForgotPassword;
