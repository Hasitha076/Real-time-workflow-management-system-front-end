import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link, useNavigate } from "react-router-dom";
import {
  Add,
  CloseRounded,
  Groups2Rounded
} from "@mui/icons-material";
import GroupsIcon from '@mui/icons-material/Groups';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import TopicIcon from '@mui/icons-material/Topic';
import LogoIcon from "../Images/logo2.png";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import axios from "axios";
import { Avatar, CircularProgress } from "@mui/material";
import { LOAD_ALL_PROJECTS } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { logout } from "../redux/userSlice";

// Styled components
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
    left: ${({ $setMenuOpen }) => ($setMenuOpen ? "0" : "-100%")};
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
  color: ${({ theme }) => theme.white};
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
  align-items: center;
  color: ${({ theme }) => theme.itemText};
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 26px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

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

// Main Component
const Menu = ({ setMenuOpen, setNewTeam }) => {
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [team, setTeams] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { loading, data } = useQuery(LOAD_ALL_PROJECTS);

  const logoutUser = async () => {
    dispatch(logout());
    dispatch(
      openSnackbar({
        message: "Logged out successfully",
        type: "success",
        severity: "success",
      })
    );
    navigate("/");
  };

  const getteams = async () => {
    setTeamsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8085/api/v1/team/getAllTeams`);
      setTeams(res.data);
    } catch (err) {
      dispatch(openSnackbar({ message: err.message, type: "error" }));
      if (err.response?.status === 401 || err.response?.status === 402) logoutUser();
    } finally {
      setTeamsLoading(false);
    }
  };

  const getAllProjects = async () => {
    setProjectsLoading(true);
    const sortedData = [...(data?.getAllProjects || [])].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setRecentProjects(sortedData);
    setProjectsLoading(false);
  };

  const handleProfile = () => {
    navigate(`/members/${currentUser.userId}`);
  };

  useEffect(() => {
    getteams();
    getAllProjects();
  }, [currentUser, loading]);

  return (
    <Container $setMenuOpen={setMenuOpen}>
      <Flex>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}>
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
        <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><SpaceDashboardIcon /> Dashboard</Item>
        </Link>
        <Link to="/projects" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><TopicIcon /> Projects</Item>
        </Link>
        <Link to="/works" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><ReceiptLongIcon /> Works</Item>
        </Link>
        <Link to="/tasks" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><PlaylistAddCheckIcon /> Tasks</Item>
        </Link>
        <Link to="/teams" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><GroupsIcon /> Teams</Item>
        </Link>
        <Link to="/members" style={{ textDecoration: "none", color: "inherit" }}>
          <Item><PersonIcon /> Members</Item>
        </Link>

        <Hr />
        <Title><Groups2Rounded /> Teams</Title>
        {teamsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
            <CircularProgress size="24px" />
          </div>
        ) : (
          team.slice(0, 3).map((team) => (
            <Link key={team.teamId} to={`/teams/${team.teamId}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                <Avatar sx={{ width: "28px", height: "28px" }}>{team.teamName[0]}</Avatar>
                {team.teamName}
              </Item>
            </Link>
          ))
        )}
        <Item onClick={() => setNewTeam(true)}>
          <Add sx={{ fontSize: "20px" }} /> New Team
        </Item>

        <Hr />
        <Title><AccountTreeIcon /> Recent Projects</Title>
        {projectsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
            <CircularProgress size="24px" />
          </div>
        ) : (
          recentProjects?.slice(0, 5).map((project) => (
            <Link key={project.projectId} to={`/projects/${project.projectId}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                <Avatar sx={{ width: "28px", height: "28px" }}>{project.projectName[0]}</Avatar>
                {project.projectName.length > 20 ? `${project.projectName.substring(0, 20)}...` : project.projectName}
              </Item>
            </Link>
          ))
        )}

        <Hr />
        <Item onClick={handleProfile}>
          <AccountBoxIcon /> My Profile
        </Item>

        <Item onClick={logoutUser}>
          <ExitToAppIcon /> Logout
        </Item>

        <Space />
      </ContainerWrapper>
    </Container>
  );
};

export default Menu;
