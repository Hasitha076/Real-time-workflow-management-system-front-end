import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import axios, { all } from "axios";
import { format } from "timeago.js";
import { tagColors } from "../data/data";

import {
  TimelapseRounded,
  StarsRounded,
  PrivacyTipRounded
} from "@mui/icons-material";
import InputIcon from '@mui/icons-material/Input';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from '@mui/material/Box';
import {Drawer, Slide } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { IconButton } from "@mui/material";
import CommentCard from "./CommentCard";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_PROJECT_BY_ID, UPDATE_PROJECT_STATUS } from "../GraphQL/Queries";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UpdateTask from "./UpdateTask";
import CheckIcon from '@mui/icons-material/Check';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
  &:hover {
    transition: all 0.6s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 10px;
  font-weight: 500;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px 14px 0px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2 + "99"};
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;


const TaskDetailCard = ({item}) => {

    const [allTaskMembers, setAllTaskMembers] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [teams, setTeams] = useState([]);


  useEffect(() => {
    getCollaborators();
    getTeams();
  }, [item]);
  
  useEffect(() => {
    if (collaborators.length && teams.length) {
      getAllTaskMembers();
    }
  }, [collaborators, teams]);
  
  const getCollaborators = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/v1/user/getAllUsers`);
      setCollaborators(res.data);

    } catch (err) {
      console.error('Error fetching collaborators:', err);
    }
  };
  
  const getTeams = async () => {
    try {
      const res = await axios.get(`http://localhost:8085/api/v1/team/getAllTeams`);
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };
  
  const getAllTaskMembers = () => {
    const collaboratorIds = item?.collaboratorIds || [];
    const teamIds = item?.teamIds || [];
  
    const collaboratorNames = collaborators
      .filter(collab => collaboratorIds.includes(collab.userId))
      .map(collab => collab.userName);
  
    const teamNames = teams
      .filter(team => teamIds.includes(team.teamId))
      .map(team => team.teamName);
  
    setAllTaskMembers([...collaboratorNames, ...teamNames]);
  };
  

  return (
    
    <>

    {item && (
            <Container className={"item"}>
            <Top>

            <Title>{item.taskName}</Title>
              {item.priority === "HIGH" &&
                <>
                <PrivacyTipRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'red' }} />
                <h6 style={{ paddingLeft: "5px", margin: "0" }} >URGENT</h6>
                </>
              }
             
              {item.priority === "MEDIUM" &&
                <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'orange' }} />
              }
      
              {item.priority === "LOW" &&
                <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'green' }} />
              }
            
            </Top>
            <Desc>{item.description}</Desc>
            <Tags>
              {item.tags.map((tag, idx) => (
                <Tag key={idx}
                  tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
                >
                  {tag}
                </Tag>
              ))}
            </Tags>
            
            <Bottom>
              <Time>
                <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
                {format(item.updatedAt)}
              </Time>
              <AvatarGroup>
                {allTaskMembers.map((member, idx) => (
                  <Avatar
                  key={idx}
                    sx={{
                      marginRight: "-5px",
                      width: "26px",
                      height: "26px",
                      fontSize: "16px",
                    }}
                  >
                    {member.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Bottom>

          </Container>
    )}
    </>
  );
};



export default TaskDetailCard;
