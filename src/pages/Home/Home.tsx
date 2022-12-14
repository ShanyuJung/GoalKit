import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useProgressiveImage } from "../../utils/hooks";
import placeholder from "../../assets/home-placeholder.jpg";

const Wrapper = styled.div<{ $url: string | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  gap: 15px;
  height: calc(100vh - 70px);
  min-width: 360px;

  @media (max-width: 921px) {
    gap: 5px;
  }

  &::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 70px;
    left: 0;
    width: 100vw;
    min-width: 360px;
    height: calc(100vh - 70px);
    background-color: #2c4859;
    background: linear-gradient(#1d3240, #658da6, #000);
    mix-blend-mode: screen;
    filter: brightness(70%);
  }

  &::after {
    content: "";
    position: fixed;
    top: 70px;
    left: 0;
    z-index: -2;
    background-image: ${(props) =>
      props.$url ? `url(${props.$url})` : `url(${placeholder})`};
    filter: ${(props) => (props.$url ? "blur(0px)" : "blur(4px)")};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 0%;
    width: 100%;
    min-width: 360px;
    height: calc(100vh - 70px);
    opacity: 0.5;
    animation: picture-loading 1s;
  }

  @keyframes picture-loading {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const LandingText = styled.div`
  font-size: 60px;
  font-weight: 700;
  line-height: 70px;
  color: #f2f2f2;
  width: 90%;
  max-width: 1152px;
  text-align: center;
  margin-bottom: 15px;
  animation: text-loading 1s;

  @media (max-width: 1200px) {
    width: 70%;
  }

  @media (max-width: 921px) {
    width: 80%;
    font-size: 50px;
    line-height: 60px;
  }

  @media (max-width: 672px) {
    font-size: 40px;
    line-height: 50px;
    margin-bottom: 5px;
  }

  @media (max-width: 537px) {
    width: 90%;
    font-size: 28px;
    line-height: 38px;
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
  font-size: 30px;
  line-height: 40px;
  font-weight: 600;
  color: #f2dac4;
  width: 80%;
  max-width: 1024px;
  text-align: center;
  margin-bottom: 10px;
  animation: text-description-loading 1s;

  @media (max-width: 921px) {
    width: 70%;
    font-size: 24px;
    line-height: 32px;
  }

  @media (max-width: 542px) {
    width: 85%;
    font-size: 18px;
    line-height: 26px;
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

const LandingButton = styled.button`
  font-size: 50px;
  font-weight: 700;
  padding: 20px 25px;
  border-radius: 10px;
  border: none;
  color: #fff;
  background-color: #67a3c9;
  cursor: pointer;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.25);
  animation: button-loading 1s;

  &:hover {
    filter: brightness(110%);
  }

  @media (max-width: 921px) {
    margin-top: 20px;
    padding: 15px 25px;
    font-size: 36px;
  }

  @media (max-width: 660px) {
    padding: 12px 20px;
    font-size: 24px;
  }

  @keyframes button-loading {
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

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const redirectHandler = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate("/dashboard");
  };

  const loaded = useProgressiveImage(
    "https://source.unsplash.com/Lks7vei-eAg/2400x1600"
  );

  return (
    <Wrapper $url={loaded}>
      <LandingText>
        GoalKit let you work more collaboratively and get more done.
      </LandingText>
      <LandingDescription>
        Boards, lists, cards and charts enable you to organize and prioritize
        your projects in a efficient, flexible and rewarding way.
      </LandingDescription>
      <LandingButton onClick={redirectHandler}>Get Started</LandingButton>
    </Wrapper>
  );
};

export default Home;
