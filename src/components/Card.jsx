import React, { useEffect, useState } from "react";
import { Fragment, useRef } from "react";
import styled from "styled-components";
import { TimelapseRounded } from "@mui/icons-material";
import { tagColors } from "../data/data";
import { Link } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import {format} from 'timeago.js';

const Container = styled.div`
  padding: 14px 14px;
  text-align: left;
  margin: 0 0px 14px 0px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
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
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 6px;
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
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 8px;
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
  gap: 6px;
  margin-top: 8px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor,theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 10px;
  font-weight: 500;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px;
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

const Card = ({ item }) => {
const ref = useRef(null);
const [teams, setTeams] = useState([]);
const [collaborators, setCollaborators] = useState([]);
const [members, setMembers] = useState([]);

const getAvailableTeams = async () => {
  try {
    const res = await axios.get("http://localhost:8085/api/v1/team/getAllTeams");
    const matchingTeams = res.data
      .filter((team) => item.teamIds.includes(team.teamId))
      .map((team) => ({
        name: team.teamName
      }));
    
    setTeams(matchingTeams);
    return matchingTeams;
  } catch (err) {
    console.log(err);
    return [];
  }
};


const getAvailableCollaborators = async () => {
  try {
    const res = await axios.get("http://localhost:8081/api/v1/user/getAllUsers");
    const matchingCollaborators = res.data
      .filter((user) => item.collaboratorIds.includes(user.userId))
      .map((user) => ({
        name: user.userName
      }));
    
    setCollaborators(matchingCollaborators);
    return matchingCollaborators;
  } catch (err) {
    console.log(err);
    return [];
  }
};


useEffect(() => {
  const fetchData = async () => {
    const [teamsData, collaboratorsData] = await Promise.all([
      getAvailableTeams(),
      getAvailableCollaborators()
    ]);

    const combinedMembers = [...teamsData, ...collaboratorsData];
    setMembers(combinedMembers);
  };

  fetchData();
}, []);


  return (
    <Link to={`/projects/${item.projectId}`} style={{ textDecoration: "none" }}>
      <Fragment>
        <Container ref={ref} className={"item"}>
          <Top>
            <Title>{item.projectName}</Title>
          </Top>
          <Desc>{item.projectDescription}</Desc>
          <Tags>
            {item.tags.map((tag, index) => (
              <Tag
              key={index}
                tagColor={
                  tagColors[Math.floor(Math.random() * tagColors.length)]
                }
              >
                {tag}
              </Tag>
            ))}
          </Tags>
          <Bottom>
            <Time>
              <TimelapseRounded sx={{fontSize: '18px'}}/> Updated {format(item.updatedAt)}
            </Time>
            <AvatarGroup>
              {members?.map((member, index) => (
                <Avatar key={index} sx={{marginRight: '-12px', width: '34px', height: '34px'}}>{member.name.charAt(0)}</Avatar>
              ))}
            </AvatarGroup>
          </Bottom>
        </Container>
      </Fragment>
    </Link>
  );
};

export default Card;
