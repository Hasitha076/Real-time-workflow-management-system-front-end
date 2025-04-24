import { Avatar, Popover } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom';
import { logout } from "../redux/userSlice";
import { tagColors } from "../data/data";

const Wrapper = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 12px;
  padding: 6px 2px;
  background-color: ${({ theme }) => theme.card};
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 16px 6px 16px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 0px 16px 0px 0px;
`;

const Name = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSoft};
`;

const Email = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft + "99"};
`;

const Hr = styled.hr`
  background-color: ${({ theme }) => theme.soft + "99"};
  border: none;
  width: 100%;
  height: 1px;
  margin: 0;
`;

const Logout = styled.div`
  padding: 0px 0px 12px 0px;
  display: flex;
  align-items: center;
  justify-content: center;;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
`;

const OutlinedBox = styled.div`
  border-radius: 6px;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.soft2+"99"};
  color: ${({ theme }) => theme.soft2+"99"};
  font-size: 12px;
  &:hover {
    background-color: ${({ theme }) => theme.soft2 + "33"};
    }
`;

const Profile = styled.div`
  display: inline-block;
`

const ButtonGroup = styled.div`
  display: flex;
  padding: 0px 16px 0 16px;
  justify-content: space-between;
  cursor: pointer;
`

const Tag = styled.div`
    display: inline-block;
    padding: 10px 15px;
    margin: 5px 0;
    border-radius: 20px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 12px;
  font-weight: 500;
`;

const AccountDialog = ({ open, anchorEl, handleClose, currentUser }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutUser = async () => {
      dispatch(logout());
      navigate("/");
      // try {
      //   await axios.post("http://localhost:8081/api/v1/auth/logout",
      //     {},  // Empty body
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`, // Send token in the header
      //       },
      //     }
      //   ).then((res) => {
      //     dispatch(logout());
      //     dispatch(
      //       openSnackbar({
      //         message: "Logout Successful",
      //         severity: "success",
      //       })
      //     );

      //     navigate("/signup"); // Redirect to signup page
      //   })
  
      // } catch (error) {
      //   dispatch(
      //     openSnackbar({
      //       message: "Logout failed",
      //       severity: "error",
      //     })
      //   );
      // }
    };

    const handleProfile = () => {
      navigate(`/members/${currentUser.userId}`);
    };
    
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
        <Account>
          <Avatar
            sx={{ width: "50px", height: "50px" }}
          >{currentUser.name != "" ? currentUser?.userName.charAt(0) : "A"}</Avatar>
          <Details>
            <Name>{currentUser.userName}</Name>
            <Email>{currentUser.email}</Email>
            <Tag
                  tagColor={
                    tagColors[Math.floor(Math.random() * tagColors.length)]
                  }
                >
                  {currentUser.role}
                </Tag>
          </Details>
        </Account>
        <Hr />
        <ButtonGroup>
        <Profile>
            <OutlinedBox onClick={handleProfile}>Go To Profile</OutlinedBox>
          </Profile>
        <Logout>
          <OutlinedBox onClick={logoutUser}>Logout</OutlinedBox>
        </Logout>
        </ButtonGroup>
      </Wrapper>
    </Popover>
  );
};

export default AccountDialog;
