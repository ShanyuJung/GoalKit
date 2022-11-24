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
  height: calc(100vh - 50px);

  &::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 50px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: #1565c0;
    opacity: 0.5;
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
    width: 100%;
    height: calc(100vh - 50px);
    opacity: 0.5;
  }
`;

const LandingText = styled.div`
  font-size: 64px;
  font-weight: 700;
  color: #fff;
  width: 80%;
  max-width: 1280px;
  text-align: center;
`;

const LandingDescription = styled.div`
  font-size: 30px;
  font-weight: 500;
  color: #fff;
  width: 75%;
  max-width: 1280px;
  text-align: center;
`;

const LandingButton = styled.button`
  font-size: 50px;
  font-weight: 700;
  padding: 20px 25px;
  border-radius: 10px;
  border: none;
  color: #fff;
  background-color: #85bf31;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.35);
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
