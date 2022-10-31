import { useRef, useState } from "react";
import styled from "styled-components";
import AuthInput from "../../components/input/AuthInput";
import LoginRoute from "../../components/route/LoginRoute";
import { useAuth } from "../../contexts/AuthContext";

const Wrapper = styled.div``;

const Card = styled.div`
  width: 500px;
  margin: auto;
`;

const Form = styled.form``;

const SubmitButton = styled.button``;

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      setErrorMessage("");
      setIsLoading(true);
      login(email, password);
    } catch {
      setErrorMessage("Fail to login.");
    }
    setIsLoading(false);
  };

  return (
    <LoginRoute>
      <Wrapper>
        <Card>
          <Form onSubmit={submitHandler}>
            <AuthInput labelText="Email" type="email" ref={emailRef} />
            <AuthInput labelText="Password" type="password" ref={passwordRef} />
            <SubmitButton disabled={isLoading}>Login</SubmitButton>
          </Form>
        </Card>
      </Wrapper>
    </LoginRoute>
  );
};

export default Login;
