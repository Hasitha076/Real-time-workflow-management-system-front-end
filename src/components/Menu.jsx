import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import {
  Add,
  CloseRounded,
  Groups2Rounded,
  Logout,
  Assignment,
  AccountTreeRounded,
  DashboardRounded,
} from "@mui/icons-material";
import GroupsIcon from '@mui/icons-material/Groups';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoIcon from "../Images/logo.png";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Avatar, CircularProgress } from "@mui/material";

const Container = styled.div`
  flex: 1.3;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.04);
  transition: 0.3s ease-in-out;
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 100;
    width: 100%;
    max-width: 250px;
    left: ${({ setMenuOpen }) => (setMenuOpen ? "0" : "-100%")};
    transition: 0.3s ease-in-out;
  }
`;
const ContainerWrapper = styled.div`
  height: 90%;
  overflow-y: scroll !important;
  margin-top: 0px;
`;
const Space = styled.div`
  height: 50px;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: bold;
  font-size: 26px;
`;

const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const Image = styled.img`
  height: 32px;
`;

const Item = styled.div`
  display: flex;
  display: "flex";
  alignItems: "center";
  whiteSpace: "nowrap";
  overflow: "hidden";
  textOverflow: "ellipsis";
  maxWidth: "200px";
  color: ${({ theme }) => theme.itemText};
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 26px;
  &:hover {
    background-color: ${({ theme }) => theme.itemHover};
  }
`;

const Hr = styled.hr`
  margin: 15px 15px 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Title = styled.h2`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft + "99"};
  margin-bottom: 4px;
  padding: 0px 26px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Menu = ({ darkMode, setDarkMode, setMenuOpen, setNewTeam }) => {
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = () => {
    navigate(`/`);
  };

  const [team, setTeams] = useState([]);
  const { currentUser } = useSelector(state => state.user);
 const [recentProjects, setRecentProjects] = useState([]);

  

  const getteams = async () => {
    setTeamsLoading(true);
    await axios.get(`http://localhost:8085/api/v1/team/getAllTeams`)
      .then((res) => {
        setTeams(res.data);
        setTeamsLoading(false);
      })
      .catch((err) => {
        dispatch(openSnackbar({ message: err.message, type: "error" }));
        if (err.response.status === 401 || err.response.status === 402) logoutUser();
      });
  };

  const getAllProjects = async () => {
    setProjectsLoading(true);
    await axios.get(`http://localhost:8083/api/v1/project/getAllProjects`)
      .then((res) => {
        const sortedData = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        setRecentProjects(sortedData);
        setProjectsLoading(false);
      })
      .catch((err) => {
        dispatch(openSnackbar({ message: err.message, type: "error" }));
        if (err.response.status === 401 || err.response.status === 402) logoutUser();
      });
  };

  console.log(team);
  console.log(recentProjects);
  

  useEffect(() => {
    getteams();
    getAllProjects();
  }, [currentUser]);

  return (
    <Container setMenuOpen={setMenuOpen} >
      <Flex>
        <Link to="/" style={{ textDecoration: "none", color: "inherit", alignItems: 'center',display: 'flex' }}>
          <Logo>
            <Image src={LogoIcon} />
            SmartFlow
          </Logo>
        </Link>
        <Close>
          <CloseRounded onClick={() => setMenuOpen(false)} />
        </Close>
      </Flex>
      <ContainerWrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <DashboardRounded />
            Dashboard
          </Item>
        </Link>
        <Link
          to="projects"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <AccountTreeRounded />
            Projects
          </Item>
        </Link>
        <Link
          to="works"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <ReceiptLongIcon />
            Works
          </Item>
        </Link>
        <Link
          to="teams"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <GroupsIcon />
            Teams
          </Item>
        </Link>
        <Link
          to="forms"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <Assignment />
            Forms
          </Item>
        </Link>
        {/* <Link
          to="community"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <People />
            Community
          </Item>
        </Link> */}
        <Hr />
        <Title>
          <Groups2Rounded /> Teams
        </Title>
        {teamsLoading ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px'}}>
            <CircularProgress size='24px' />
          </div>
        ) : (<>
          {team.slice(0, 3).map((team, i) => (
            <Link
              to={`/teams/${team._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>

                  <Avatar sx={{ width: "28px", height: "28px" }}>{team.teamName[0]}</Avatar>
                {team.teamName}
              </Item>
            </Link>
          ))}
        </>
        )}
        <Item onClick={() => setNewTeam(true)}>
          <Add sx={{ fontSize: "20px" }} />
          New Team
        </Item>
        <Hr />
        <Title>
          <AccountTreeIcon /> Recent Projects
        </Title>
        {projectsLoading ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px'}}>
            <CircularProgress size='24px' />
          </div>
        ) : (<>
          {recentProjects
          
            .slice(0, 5).map((project, i) => (
            <Link
              to={`/projects/${project.projectId}`}
              style={{ textDecoration: "none", color: "inherit" }}

            >
              <Item style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>

                  <Avatar sx={{ width: "28px", height: "28px" }}>{project.projectName[0]}</Avatar>
                {project.projectName.substring(0, 20)}...
              </Item>
            </Link>
          ))}
        </>
        )}
        <Hr />
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
        <Item onClick={() => logoutUser()}>
          <Logout />
          Logout
        </Item>
        <Space />
      </ContainerWrapper>
    </Container >
  );
};

export default Menu;
