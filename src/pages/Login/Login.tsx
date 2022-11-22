import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import LoginRoute from "../../components/route/LoginRoute";
import { useAuth } from "../../contexts/AuthContext";

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

const StyledLink = styled(Link)`
  color: #0d6efd;
  font-size: 16px;
`;

const Text = styled.div`
  margin-top: 10px;
  color: #000;
`;

const ErrorMessageWrapper = styled.div`
  border: 1px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
  width: 80%;
  text-align: center;
  font-size: 20px;
  height: 40px;
  line-height: 40px;
  background-color: #fadbd8;
`;

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
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

  return (
    <LoginRoute>
      <Wrapper>
        <Card>
          {errorMessage === "" ? (
            <></>
          ) : (
            <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
          )}
          <Form onSubmit={submitHandler}>
            <AuthInput labelText="Email" type="email" ref={emailRef} />
            <AuthInput labelText="Password" type="password" ref={passwordRef} />
            <SubmitButton disabled={isLoading}>Login</SubmitButton>
          </Form>
          <StyledLink to="/forget-password">Forget Password ?</StyledLink>
        </Card>
        <Text>
          Don't have an account? <StyledLink to="/signup"> Signup</StyledLink>
        </Text>
      </Wrapper>
    </LoginRoute>
  );
};

export default Login;
