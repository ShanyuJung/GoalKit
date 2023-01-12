import { useEffect, useState } from "react";
import styled from "styled-components";
import { LoginRoute } from "../../components/route/PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import placeholder from "../../assets/signup-placeholder.jpg";
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
    height: calc(100vh - 70px);
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
  /* overflow-y: auto; */
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
  background-color: #f2f2f2;
  margin-top: -70px;

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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 5px 0px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  padding: 0px 5px;
  margin-bottom: 5px;
  color: #1d3240;
  margin-left: 10px;
  position: relative;
  width: fit-content;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const StyledInput = styled.input<{ $isValid: boolean }>`
  margin: 0;
  font-size: 24px;
  line-height: 40px;
  height: 40px;
  border-radius: 20px;
  padding: 0px 20px;
  border: 1px solid #ccc;
  outline: ${(props) => (props.$isValid ? "none" : "1px #e74c3c solid")};

  @media (max-width: 600px) {
    font-size: 18px;
    line-height: 28px;
    height: 28px;
  }
`;

const InputErrorText = styled.div`
  font-size: 14px;
  color: #e74c3c;
  padding-top: 5px;
  padding-left: 15px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
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

const DEFAULT_ERROR_MESSAGE = {
  message: "",
  nameValid: true,
  nameError: "",
  emailValid: true,
  emailError: "",
  passwordValid: true,
  passwordError: "",
  passwordConfirmValid: true,
  passwordConfirmError: "",
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE);

  const nameValidHandler = () => {
    if (!name) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          nameValid: false,
          nameError: "Name can not be empty.",
        };
      });
      return false;
    }

    setErrorMessage((prevErrorMessage) => {
      return {
        ...prevErrorMessage,
        nameValid: true,
        nameError: "",
      };
    });
    return true;
  };

  const emailValidHandler = () => {
    if (!email) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          emailValid: false,
          emailError: "Email can not be empty.",
        };
      });
      return false;
    }
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    if (!emailRule.test(email)) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          emailValid: false,
          emailError: "Invalid email format.",
        };
      });
      return false;
    }

    setErrorMessage((prevErrorMessage) => {
      return {
        ...prevErrorMessage,
        emailValid: true,
        emailError: "",
      };
    });
    return true;
  };

  const passwordValidHandler = () => {
    if (!password) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          passwordValid: false,
          passwordError: "Password can not be empty.",
        };
      });
      return false;
    }

    if (!/^([A-Za-z]|[0-9])+$/.test(password)) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          passwordValid: false,
          passwordError: "Password only allow a-z, A-Z and numbers.",
        };
      });
      return false;
    }

    if (password.length < 6 || password.length > 20) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          passwordValid: false,
          passwordError:
            "Minimum 6 characters in length, Maximum 20 characters.",
        };
      });
      return false;
    }
    setErrorMessage((prevErrorMessage) => {
      return {
        ...prevErrorMessage,
        passwordValid: true,
        passwordError: "",
      };
    });

    return true;
  };

  const passwordConfirmValidHandler = () => {
    if (!passwordConfirm) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          passwordConfirmValid: false,
          passwordConfirmError: "Password confirm can not be empty.",
        };
      });

      return false;
    }

    if (password !== passwordConfirm) {
      setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          passwordConfirmValid: false,
          passwordConfirmError: "Passwords didn't match.",
        };
      });
      return false;
    }
    setErrorMessage((prevErrorMessage) => {
      return {
        ...prevErrorMessage,
        passwordConfirmValid: true,
        passwordConfirmError: "",
      };
    });
    return true;
  };

  const submitHandler = async () => {
    if (isLoading) return;
    setErrorMessage({ ...DEFAULT_ERROR_MESSAGE });

    const isNameValid = nameValidHandler();
    const isEmailValid = emailValidHandler();
    const isPasswordValid = passwordValidHandler();
    const isPasswordConfirmValid = passwordConfirmValidHandler();

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isPasswordConfirmValid
    ) {
      return setErrorMessage((prevErrorMessage) => {
        return {
          ...prevErrorMessage,
          message: "Failed to create an account.",
        };
      });
    }

    try {
      setIsLoading(true);
      await signup(email, password, name);
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === "Firebase: Error (auth/invalid-email)."
      ) {
        setErrorMessage((prevErrorMessage) => {
          return {
            ...prevErrorMessage,
            emailValid: false,
            emailError: "Invalid email",
            message: "Failed to create an account.",
          };
        });
      } else {
        setErrorMessage((prevErrorMessage) => {
          return {
            ...prevErrorMessage,
            message: "Failed to create an account.",
          };
        });
      }
    }
    setIsLoading(false);
  };

  const loaded = useProgressiveImage(
    "https://source.unsplash.com/5QgIuuBxKwM/1920x1280"
  );
  // console.log(errorMessage);

  useEffect(() => {
    if (!errorMessage.nameValid) {
      nameValidHandler();
    }
    if (!errorMessage.emailValid) {
      emailValidHandler();
    }
    if (!errorMessage.passwordValid) {
      passwordValidHandler();
    }
    if (!errorMessage.passwordConfirmValid) {
      passwordConfirmValidHandler();
    }
  }, [name, email, password, passwordConfirm]);

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
            <CardTitle>Signup</CardTitle>
            {errorMessage.message === "" ? (
              <DescriptionText>Signup to join GoalKit for free</DescriptionText>
            ) : (
              <ErrorMessageWrapper>{errorMessage.message}</ErrorMessageWrapper>
            )}
            <Form>
              <InputWrapper>
                <InputLabel>Name</InputLabel>
                <StyledInput
                  type="text"
                  required
                  autoComplete="off"
                  $isValid={errorMessage.nameValid}
                  onChange={(e) => {
                    setName(e.target.value.trim());
                  }}
                />
                {errorMessage.nameError && (
                  <InputErrorText>{errorMessage.nameError}</InputErrorText>
                )}
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Email</InputLabel>
                <StyledInput
                  type="email"
                  required
                  autoComplete="off"
                  $isValid={errorMessage.emailValid}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                  }}
                />
                {errorMessage.emailError && (
                  <InputErrorText>{errorMessage.emailError}</InputErrorText>
                )}
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Password</InputLabel>
                <StyledInput
                  type="password"
                  required
                  autoComplete="off"
                  $isValid={errorMessage.passwordValid}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {errorMessage.passwordError && (
                  <InputErrorText>{errorMessage.passwordError}</InputErrorText>
                )}
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Password Confirm</InputLabel>
                <StyledInput
                  type="password"
                  required
                  autoComplete="off"
                  $isValid={errorMessage.passwordConfirmValid}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                  }}
                />
                {errorMessage.passwordConfirmError && (
                  <InputErrorText>
                    {errorMessage.passwordConfirmError}
                  </InputErrorText>
                )}
              </InputWrapper>
              <SubmitButton
                type="button"
                disabled={isLoading}
                onClick={submitHandler}
              >
                Signup
              </SubmitButton>
            </Form>
            <Text>
              {"Already have an account? "}
              <StyledLink to="/login" $fontWeight={600}>
                Login
              </StyledLink>
            </Text>
          </Card>
        </CardWrapper>
      </Wrapper>
    </LoginRoute>
  );
};

export default Signup;
