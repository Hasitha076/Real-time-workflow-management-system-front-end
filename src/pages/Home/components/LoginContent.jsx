import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderImage from "../../../Images/bg-image.svg";
import logo from '../../../Images/logo2.png';
import LoginIcon from '@mui/icons-material/Login';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AOS from 'aos';
import 'aos/dist/aos.css';
import tinycolor from 'tinycolor2';

const Container = styled.div`
  height: 80vh;
  margin: 6px 14px;
  max-width: 1320px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 80px;
  padding: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px 12px 30px 12px !important;
    height: 70vh;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TitleTag = styled.div`
  font-family: "PT Serif", serif;
  font-size: 50px;
  @media (max-width: 768px) {
    font-size: 40px;
  }
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  width: 30%;
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 600;
  background-color: #fff;
  color: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.4s ease;
  border-radius: 10px;
  cursor: pointer;
  @media (max-width: 1250px) {
    width: 30%;
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 16px;
  }
  &:hover {
    background-color: ${(props) => props.hoverColor};
    color: ${(props) => props.hoverTextColor};
    transform: translateY(-2px);
  }
`;

const Image = styled.img`
  width: 600px;
  height: 600px;
  flex: 0.8;
  display: flex;
  object-fit: scale-down;
  border-radius: 10px;
  @media (max-width: 1000px) {
    display: none;
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  flex: 0.8;
  display: flex;
  object-fit: scale-down;
  border-radius: 10px;
  @media (max-width: 1000px) {
    display: none;
  }
`;

const LoginContent = ({ setSignInOpen, setSignUpOpen, bgColor }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const bgNewColor = bgColor || "#a21ae6";
  const hoverColor = tinycolor(bgColor).lighten(20).toString();
  const hoverTextColor = tinycolor(hoverColor).isLight() ? "#000" : "#fff";

  if (loading) {
    return (
      <Container id="home" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            sx={{ width: '120px !important', height: '120px !important', color: '#a21ae6' }}
            thickness={4}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container id="home">
      <Left data-aos="fade-right">
        <Logo src={logo} />
        <TitleTag><b>Real-Time Workflow Automation & Management System</b></TitleTag>
        <ButtonContainer>
          <StyledButton
            onClick={() => setSignInOpen(true)}
            bgNewColor={bgNewColor}
            hoverColor={hoverColor}
            hoverTextColor={hoverTextColor}
          >
            <LoginIcon /> Log In
          </StyledButton>
          <StyledButton
            onClick={() => setSignUpOpen(true)}
            bgNewColor={bgNewColor}
            hoverColor={hoverColor}
            hoverTextColor={hoverTextColor}
          >
            <GroupAddIcon /> Register
          </StyledButton>
        </ButtonContainer>
      </Left>
      <Image src={HeaderImage} data-aos="fade-left" />
    </Container>
  );
};

export default LoginContent;
