import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginContent from './components/LoginContent';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';

// List of background colors to cycle through
const bgColors = ['#13111C', '#1A1A2E', '#0F3460', '#16213E', '#1f1f1f'];

const Body = styled.div`
  background: ${(props) => props.bgColor || '#13111C'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  transition: background 1s ease-in-out;
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-image: linear-gradient(38.73deg, rgba(204, 0, 187, 0.25) 0%, rgba(201, 32, 184, 0) 50%), 
                    linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.25) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 50px;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), 
              linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%,50% 95%, 0 100%);
  @media (max-width: 768px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%,50% 98%, 0 100%);
    padding-bottom: 0px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgColors.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Body bgColor={bgColors[bgIndex]}>
      <Container>
        <Top>
          <LoginContent setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} bgColor={bgColors[bgIndex]} />
        </Top>
        {signInOpen && (
          <SignIn
            SignInOpen={signInOpen}
            setSignInOpen={setSignInOpen}
            setSignUpOpen={setSignUpOpen}
          />
        )}
        {signUpOpen && (
          <SignUp
            SignUpOpen={signUpOpen}
            setSignUpOpen={setSignUpOpen}
            setSignInOpen={setSignInOpen}
          />
        )}
      </Container>
    </Body>
  );
};

export default Home;
