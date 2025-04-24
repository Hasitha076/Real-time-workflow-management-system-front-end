import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import {
  TimelapseRounded
} from "@mui/icons-material";
import { format } from "timeago.js";
import { tagColors } from "../data/data";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import axios from "axios";

const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
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
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 0;
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

const TeamCards = ({ teams }) => {
  
  const [collaborators, setCollaborators] = useState([]);
  const [availableCollaborators, setAvailableCollaborators] = useState([]);

  const getCollaborators = async () => {
    await axios.get(`http://localhost:8081/api/v1/user/getAllUsers`)
      .then((res) => {
        setCollaborators(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCollaborators();
  }, [teams]);

    useEffect(() => {
  
        const matchingUsers = collaborators
      .filter((user) => teams.collaboratorIds.includes(user.userId))
      .map((user) => ({
        id: user.userId,
        name: user.userName,
        email: user.email,
      }));

    setAvailableCollaborators(matchingUsers);
    
      }, [teams, collaborators]);

  return (
    <Link to={`/teams/${teams.teamId}`} style={{ textDecoration: "none" }}>
    <Container className={"item"}>
      <Top style={{ display: "flex", alignItems: "center" }}>
      <Avatar
              sx={{
                marginRight: "13px",
                width: "26px",
                height: "26px",
                fontSize: "16px",
                borderRadius: '0',
                backgroundColor: tagColors[Math.floor(Math.random() * tagColors.length)],
              }}
            >
              {teams.teamName.charAt(0)}
            </Avatar>
        <Title>{teams.teamName}</Title>
      </Top>
      <Desc>{teams.description}</Desc>
      <Tags>
        {teams.tags.map((tag, key) => (
          <Tag key={key}
            tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
          >
            {tag}
          </Tag>
        ))}
      </Tags>
      <Bottom>
        <Time>
          <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
          {format(teams.updatedAt)}
        </Time>
        <AvatarGroup>
          {availableCollaborators.map((member, key) => (
            <Avatar
            key={key}
              sx={{
                marginRight: "-13px",
                width: "26px",
                height: "26px",
                fontSize: "16px",
              }}
            >
              {member.name.charAt(0)}
            </Avatar>
          ))}
          {availableCollaborators.length > 2 && (
            <Avatar
              sx={{
                marginRight: "-13px",
                width: "26px",
                height: "26px",
                fontSize: "12px",
              }}
            >
              +{availableCollaborators.length - 2}
            </Avatar>
          )}
        </AvatarGroup>
      </Bottom>
    </Container>
    </Link>
  );
};

export default TeamCards;
