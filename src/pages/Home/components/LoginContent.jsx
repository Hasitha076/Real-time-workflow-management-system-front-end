import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderImage from "../../../Images/Header.png";
import logo from '../../../Images/logo.png';
import LoginIcon from '@mui/icons-material/Login';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  font-size: 58px;
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

const Button = styled.button`
  width: 30%;
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(76.35deg, #801ae6 15.89%, #a21ae6 89.75%);
  color: ${({ theme }) => theme.text};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 800ms;
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
    background: #fff;
    color: #a21ae6;
  }
`;

const Image = styled.img`
  width: 500px;
  height: 500px;
  flex: 0.8;
  display: flex;
  object-fit: scale-down;
  border-radius: 10px;
  @media (max-width: 1000px) {
    display: none;
  }
`;

const Logo = styled.img`
  width: 70px;
  height: 70px;
  flex: 0.8;
  display: flex;
  object-fit: scale-down;
  border-radius: 10px;
  @media (max-width: 1000px) {
    display: none;
  }
`;

const LoginContent = ({ setSignInOpen, setSignUpOpen }) => {
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
        return prevProgress + 1; // Increment by 1
      });
    }, 50); // Adjust timing as needed for smooth speed
  
    return () => clearInterval(interval);
  }, []);
  

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
      <Typography
        variant="h6" // Larger font for percentage
        component="div"
        sx={{ color: '#fff' }}
      >
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
    <TitleTag><b>Workflow Automation & Management System</b></TitleTag>
    <ButtonContainer>
      <Button onClick={() => setSignInOpen(true)}>
        <LoginIcon /> Log In
      </Button>
      <Button onClick={() => setSignUpOpen(true)}>
        <GroupAddIcon /> Register
      </Button>
    </ButtonContainer>
  </Left>
  <Image src={HeaderImage} data-aos="fade-left" />
</Container>

  );
};

export default LoginContent;
