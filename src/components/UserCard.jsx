import React from "react";
import styled from "styled-components";
import {
  TimelapseRounded
} from "@mui/icons-material";
import { format } from "timeago.js";
import { tagColors } from "../data/data";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

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
  font-size: 20px;
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

const Tag = styled.div`
  display: inline-block;
    padding: 10px 15px;
    border-radius: 20px;
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


const UserCard = ({ users }) => {
  
  return (
    <Link to={`/members/${users.userId}`} style={{ textDecoration: "none" }}>
    <Container className={"item"}>
      <Top style={{ display: "flex", alignItems: "center" }}>
        <Avatar
                sx={{
                    marginRight: "13px",
                    width: "40px",
                    height: "40px",
                    fontSize: "16px",
                    borderRadius: '20px',
                    backgroundColor: tagColors[Math.floor(Math.random() * tagColors.length)],
                }}
                >
                {users.userName.charAt(0)}
            </Avatar>
            <Title>{users.userName}</Title>

            <Tag
        tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
        >
        {users.role}
        </Tag>
      </Top>
        
      <Bottom>
        <Time>
          <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
          {format(users.updatedAt)}
        </Time>
      </Bottom>
    </Container>
    </Link>
  );
};

export default UserCard;
