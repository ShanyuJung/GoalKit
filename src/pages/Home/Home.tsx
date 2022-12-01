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
  overflow: scroll;
  gap: 15px;
  height: calc(100vh - 70px);

  &::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 50px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: #2c4859;
    background: linear-gradient(#1d3240, #658da6, #000);
    mix-blend-mode: screen;
    filter: brightness(70%);
  }

  &::after {
    content: "";
    position: fixed;
    top: 50px;
    left: 0;
    z-index: -2;
    background-image: ${(props) =>
      props.$url ? `url(${props.$url})` : `url(${placeholder})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 0%;
    width: 100%;
    height: calc(100vh - 50px);
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
