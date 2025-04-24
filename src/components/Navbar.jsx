import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { NotificationsRounded } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import AccountDialog from "./AccountDialog";
import NotificationDialog from "./NotificationDialog";
import axios from "axios";
import Person3Icon from '@mui/icons-material/Person3';
import CustomizedSwitches from "./ModeButton";

const Container = styled.div`
  position: sticky;
  top: 0;
  height: 56px;
  margin: 6px 6px 0px 6px;
  border-radius: 12px;
  z-index: 99;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.06);
  background-color: ${({ theme }) => theme.bgLighter};
  @media screen and (max-width: 480px) {
    margin: 0px 0px 0px 0px;
    height: 60px;
  }
`;
const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 14px;
  @media screen and (max-width: 480px) {
    padding: 0px 4px;
  }
  position: relative;
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const Search = styled.div`
  width: 40%;
  @media screen and (max-width: 480px) {
    width: 50%;
  }
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 100px;
  color: ${({ theme }) => theme.textSoft};
  background-color: ${({ theme }) => theme.bgDark};
`;
const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 100px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const Button = styled.button`
  padding: 5px 18px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.black};
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 18px;
  padding: 0px 8px;
  color: ${({ theme }) => theme.text};
  @media (max-width: 800px) {
    gap: 2px;
}
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
  max-width: 200px;

  &:hover {
    background-color: ${({ theme }) => theme.itemHover};
  }
`;

const Navbar = ({ menuOpen, setMenuOpen, token, darkMode, setDarkMode }) => {
  const [SignInOpen, setSignInOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);

  //Open the account dialog
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Open the notification dialog
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;
  const notificationClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const notificationClose = () => {
    setAnchorEl2(null);
  };

  const getNotification = async () => {
    await axios.get("http://localhost:8084/api/v1/notification/getAllNotifications")
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
      getNotification();
    }, []);
    

  return (
    <>
      <Container>
        <Wrapper>
          <IcoButton onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon />
          </IcoButton>
        
          <User>
            {currentUser ? (
              <>
              <CustomizedSwitches darkMode={darkMode} setDarkMode={setDarkMode} />
         
                <IcoButton aria-describedby={id} onClick={notificationClick}>
                  <Badge badgeContent={notifications.length} color="primary">
                    <NotificationsRounded />
                  </Badge>
                </IcoButton>
                <IcoButton aria-describedby={id} onClick={handleClick}>
                  <Badge
                    badgeContent="    "
                    color="success"
                    variant="dot"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar
                      alt={currentUser.name}
                      sx={{ width: 34, height: 34 }}
                    >
                      {currentUser.name != "" ? currentUser?.userName.charAt(0) : "A"}
                    </Avatar>
                  </Badge>
                </IcoButton>
              </>
            ) : (
              <Button onClick={() => setSignInOpen(true)}>
                <Person3Icon /> Sign In
              </Button>
            )}
          </User>
        </Wrapper>
      </Container>
      {currentUser && (
        <AccountDialog
          open={open}
          anchorEl={anchorEl}
          id={id}
          handleClose={handleClose}
          currentUser={currentUser}
          token={token}
        />
      )}
      {currentUser && (
        <NotificationDialog
          open={open2}
          anchorEl={anchorEl2}
          id={id2}
          handleClose={notificationClose}
          currentUser={currentUser}
          notification={notifications}
        />
      )}
    </>
  );
};

export default Navbar;
