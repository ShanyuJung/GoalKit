import { useRef, useState } from "react";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import LoginRoute from "../../components/route/LoginRoute";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

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
  font-size: 16px;
  min-height: 40px;
  line-height: 40px;
  background-color: #fadbd8;
`;

const Signup = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const passwordConfirm = passwordConfirmRef.current?.value || "";

    if (password === "" || password !== passwordConfirm) {
      return setErrorMessage("Passwords didn't match.");
    }

    try {
      setErrorMessage("");
      setIsLoading(true);
      await signup(email, password, name);
    } catch {
      setErrorMessage("Fail to create an account.");
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
            <AuthInput labelText="Name" type="text" ref={nameRef} />
            <AuthInput labelText="Email" type="email" ref={emailRef} />
            <AuthInput labelText="Password" type="password" ref={passwordRef} />
            <AuthInput
              labelText="Password Confirm"
              type="password"
              ref={passwordConfirmRef}
            />
            <SubmitButton disabled={isLoading}>SignUp</SubmitButton>
          </Form>
        </Card>
        <Text>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </Text>
      </Wrapper>
    </LoginRoute>
  );
};

export default Signup;
