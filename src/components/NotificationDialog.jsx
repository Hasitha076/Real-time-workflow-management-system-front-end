import { Avatar, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 6px 2px;
  background-color: ${({ theme }) => theme.card};
`;

const Heading = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 4px 0px 12px 12px;
`;

const Item = styled.div`
  display: flex;
  gap: 10px;
  padding: 4px 12px 0px 12px;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0px 0px 0px 0px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
`;

const Desc = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft + "99"};
`;

const Hr = styled.hr`
  background-color: ${({ theme }) => theme.soft + "99"};
  border: none;
  width: 100%;
  height: 1px;
  margin-top: 4px;
`;

const NotificationDialog = ({
  open,
  id,
  anchorEl,
  handleClose,
  currentUser,
  notification,
}) => {


  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    await axios.get("http://localhost:8084/api/v1/notification/getAllNotifications")
    .then((res) => {
    
      setNotifications(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  };

    useEffect(() => {
      getNotifications();
    }, []);

    console.log(notifications);
    


  return (
    <Popover
      anchorReference="anchorPosition"
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorPosition={{ top: 60, left: 1800 }}
    >
      <Wrapper>
        <Heading>Notifications</Heading>

        {notification.map((item, index) => (
          <Item key={index}>
            <Avatar
              sx={{ width: "32px", height: "32px" }}
              src={currentUser.img}
            >
              {currentUser.name.charAt(0)}
            </Avatar>
            <Details>
              <Title>{item.subject === "team-created" ? "Team Invitation" : "Other"}</Title>
              <Desc>{item.message}</Desc>
              <Hr />
            </Details>
          </Item>
        ))}

      </Wrapper>
    </Popover>
  );
};

export default NotificationDialog;
