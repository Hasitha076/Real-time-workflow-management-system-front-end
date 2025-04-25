import { Avatar, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { openSnackbar } from "../redux/snackbarSlice";

const Wrapper = styled.div`
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  height: '-webkit-fill-available';
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 6px 2px;
  background-color: ${({ theme }) => theme.card};
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.black} !important;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.white};
`

const Heading = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: ${({ theme }) => theme.black};
  padding-left: 15px;
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
  anchorEl,
  handleClose
}) => {


  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  const getNotifications = async () => {
    await axios.get("http://localhost:8084/api/v1/notification/getAllNotifications", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":   "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => {

      const filterDAta = res.data.filter((item) => {
        return item.collaboratorIds.includes(currentUser.userId);
      }
      );
      setNotifications(filterDAta);
    })
    .catch((err) => {
      console.log(err);
    });
  };

    useEffect(() => {
      getNotifications();
    }, []);


    const clearAll =  async () => {
      await axios.delete(`http://localhost:8084/api/v1/notification/clearNotificationById/${currentUser.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":   "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        dispatch(
          openSnackbar({
            message: "Clear all notifications",
            severity: "success",
          })
        );
        getNotifications();
      })
      .catch((err) => {
        console.log(err);
      });
    }

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
        <Top>
          <Heading>Notifications</Heading>
          {notifications.length != 0 ? <IcoButton onClick={clearAll}>
                <DeleteForeverIcon />
          </IcoButton>
          : null}
        </Top>

        {notifications.length === 0 ? (
  <p style={{ textAlign: "center", color: "#888" }}>Empty</p>
) : (
  [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    // .slice(0, 10)
    .map((item, index) => (
      <Item key={index}>
        <Avatar
          sx={{ width: "32px", height: "32px" }}
          src={currentUser.img}
        >
          {currentUser.userName.charAt(0)}
        </Avatar>
        <Details>
          <Title>
            {item.subject === "project-created"
              ? "Project Invitation"
              : item.subject === "project-changed"
              ? "Project changed"
              : item.subject === "removed-from-project"
              ? "Removed from project"
              : item.subject === "project-removed"
              ? "Project removed"
              : item.subject === "task-created"
              ? "Task Invitation"
              : item.subject === "task-changed"
              ? "Task changed"
              : item.subject === "task-status-changed"
              ? "Task status changed"
              : item.subject === "removed-from-task"
              ? "Removed from task"
              : item.subject === "task-removed"
              ? "Task removed"
              : item.subject === "team-created"
              ? "Team Invitation"
              : item.subject === "team-changed"
              ? "Team changed"
              : item.subject === "removed-from-team"
              ? "Removed from team"
              : item.subject === "team-removed"
              ? "Team removed"
              : item.subject === "work-created"
              ? "Work Invitation"
              : item.subject === "work-changed"
              ? "Work changed"
              : item.subject === "removed-from-work"
              ? "Removed from work"
              : item.subject === "work-removed"
              ? "Work removed"
              : "Other"}
          </Title>
          <Desc>{item.body}</Desc>
          <Hr />
        </Details>
      </Item>
    ))
)}
      </Wrapper>
    </Popover>
  );
};

export default NotificationDialog;
