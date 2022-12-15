import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import LoginRoute from "../../components/route/LoginRoute";
import { useAuth } from "../../contexts/AuthContext";
import placeholder from "../../assets/login-placeholder.jpg";
import { useProgressiveImage } from "../../utils/hooks";

const Wrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  min-width: 360px;
  overflow: auto;

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
  padding-top: 80px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-width: 550px;
  align-items: center;
  animation: card-loading 1s;

  @media (max-width: 600px) {
    min-width: auto;
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
  background-color: #f2f2f2;

  @media (max-width: 600px) {
    width: 90vw;
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

const StyledLink = styled(Link)<{ $fontWeight?: number; $color?: string }>`
  color: ${(props) => (props.$color ? props.$color : "#658da6")};
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

const DescriptionText = styled.div`
  height: 42px;
  line-height: 40px;
  font-size: 16px;
  color: #658da6;
  margin-bottom: 5px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
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

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      setErrorMessage("");
      setIsLoading(true);
      await login(email, password);
    } catch (e) {
      setErrorMessage("Fail to login.");
    }
    setIsLoading(false);
  };

  const loaded = useProgressiveImage(
    "https://source.unsplash.com/MChSQHxGZrQ/1920x2878"
  );

  return (
    <LoginRoute>
      <Wrapper>
        <LandingWrapper $url={loaded} />
        <CardWrapper>
          <Card>
            <CardTitle>Login</CardTitle>
            {errorMessage === "" ? (
              <DescriptionText>
                Login to start your work with GoalKit
              </DescriptionText>
            ) : (
              <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
            )}
            <Form onSubmit={submitHandler}>
              <AuthInput labelText="Email" type="email" ref={emailRef} />
              <AuthInput
                labelText="Password"
                type="password"
                ref={passwordRef}
              />
              <SubmitButton disabled={isLoading}>Login</SubmitButton>
            </Form>
            {errorMessage && (
              <StyledLink
                to="/forgot-password"
                $color="#e74c3c"
                $fontWeight={600}
              >
                Forgot your Password ?
              </StyledLink>
            )}
            <Text>
              {"Don't have an account ? "}
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

export default Login;
