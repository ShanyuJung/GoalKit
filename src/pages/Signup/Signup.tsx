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

const Signup = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

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
      signup(email, password, name);
      setMessage("Success to create an account.");
    } catch {
      setErrorMessage("Fail to create an account.");
    }
    setIsLoading(false);
  };

  return (
    <LoginRoute>
      <Wrapper>
        <Card>
          <Form onSubmit={submitHandler}>
            <AuthInput labelText="Name" type="text" ref={nameRef} />
            <AuthInput labelText="Email" type="email" ref={emailRef} />
            <AuthInput labelText="Password" type="password" ref={passwordRef} />
            <AuthInput
              labelText="Password Confirm"
              type="password"
              ref={passwordConfirmRef}
            />
            <SubmitButton disabled={isLoading}>Sign Up</SubmitButton>
          </Form>
        </Card>
      </Wrapper>
    </LoginRoute>
  );
};

export default Signup;
