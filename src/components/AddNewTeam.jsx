import { IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {
  CloseRounded
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: min-content;
  margin: 2%;
  max-width: 600px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px 20px;
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 12px 20px 0px 20px;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  ${({ googleButton, theme }) =>
    googleButton &&
    `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
    font-weight: 600;
    font-size: 16px;
    background: ${theme.soft};
    color:'${theme.soft2}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 12px 20px;
  align-items: center;
  justify-content: space-between;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const AddMember = styled.div`
  margin: 22px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgDark + "98"};
`;

const UsersList = styled.div`
  padding: 18px 8px;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`;
const UserData = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Details = styled.div`
  gap: 4px;
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
`;

const EmailId = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft + "99"};
`;


const Flex = styled.div`
display: flex;
flex-direction: row;
gap: 2px;
@media (max-width: 768px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;

const Role = styled.div`
  background-color: ${({ theme }) => theme.bgDark};
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InviteButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 1px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  border-radius: 10px;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
`;

const AddNewTeam = ({ setNewTeam }) => {
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [backDisabled, setBackDisabled] = useState(false);
  const navigate = useNavigate();

  const [showAddTeam, setShowAddTeam] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const[availableUsers, setAvailableUsers] = useState([]);
  const [inputs, setInputs] = useState({ 
      teamName: "", 
      description: "",
      tags: "",
      collaboratorIds: []
    });

  const goToAddTeam = () => {
    setShowAddTeam(true);
    setShowAddMember(false);
  };

  const goToAddMember = () => {
    setShowAddTeam(false);
    setShowAddMember(true);
  };

  const [users, setUsers] = useState([]);

  const handleSelect = (user) => {
    const User = {
      id: user.userId,
      name: user.userName,
      email: user.email,
      role: user.role
    };
    if (selectedUsers.find((u) => u.id === User.userId)) {
    } else {
      setSelectedUsers([...selectedUsers, {
        id: user.userId,
        name: user.userName,
        email: user.email,
        role: user.role,
      }]);
      setUsers([]);
    }
  };

  //remove members from selected users
  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.userId));
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      if (e.target.name === "tags") {
        return { ...prev, [e.target.name]: e.target.value.split(",") };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  };

  const handleTeamSuccess = (link) => {
    setLoading(false);
    navigate(`${link}`);
  }

  const CreateTeam = () => {
    setLoading(true);
    setDisabled(true);
    setBackDisabled(true);
 
    axios.post("http://localhost:8085/api/v1/team/createTeam", {
      teamName: inputs.teamName,
      teamDescription: inputs.description,
      tags: inputs.tags,
      collaboratorIds: selectedUsers.map((user) => user.id)
    })
      .then((res) => {
   
        setLoading(false);
        setNewTeam(false);
        handleTeamSuccess("/teams");
        dispatch(
          openSnackbar({
            message: "Team created successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDisabled(false);
        setBackDisabled(false);
        dispatch(
          openSnackbar({
            message: "Something went wrong",
            type: "error",
          })
        );
      });
  };


  const getAvailableUsers = async () => {
    await axios.get("http://localhost:8081/api/v1/user/getAllUsers")
    .then((res) => {
      setAvailableUsers(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    getAvailableUsers();
    if (inputs.title === "" || inputs.desc === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [inputs]);

  const dispatch = useDispatch();
  

  return (
    <Modal open={true} onClose={() => setNewTeam(false)}>
      <Container>
        <Wrapper>
          <IconButton
            style={{
              position: "absolute",
              top: "18px",
              right: "30px",
              cursor: "pointer",
              color: "inherit",
            }}
            onClick={() => setNewTeam(false)}
          >
            <CloseRounded style={{ color: "inherit" }} />
          </IconButton>
          <Title>Create a new Team</Title>

          {showAddTeam && (
            <>
              <Label>Team Details :</Label>
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  placeholder="Team Name (Required)*"
                  type="text"
                  name="teamName"
                  value={inputs.teamName}
                  onChange={handleChange}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Description (Required)* "
                  name="description"
                  rows={5}
                  value={inputs.description}
                  onChange={handleChange}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                  name="tags"
                  rows={4}
                  value={inputs.tags}
                  onChange={handleChange}
                />
              </OutlinedBox>

              <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: "22px", marginBottom: "18px" }}
                onClick={() => { !disabled && goToAddMember() }}
              >
                Next
              </OutlinedBox>
            </>
          )}

        {showAddMember && (
            <>
            <Label>Add Members :</Label>

            <AddMember>

                <UsersList>
                {availableUsers.map((user) => (
                    <MemberCard>
                    <UserData>
                        <Avatar
                        sx={{ width: "34px", height: "34px" }}
                        >
                        {user.userName.charAt(0)}
                        </Avatar>
                        <Details>
                        <Name>{user.userName}</Name>
                        <EmailId>{user.email}</EmailId>
                        </Details>
                    </UserData>
                    <Flex>
                        <Role>{user.role}</Role>
                    </Flex>
                    {
                        !selectedUsers.find((u) => u.id === user.userId) && 
                        <InviteButton onClick={() => handleSelect(user)}>
                        Add
                        </InviteButton>
                    }
                    {
                        selectedUsers.find((u) => u.id === user.userId) && 
                        <InviteButton onClick={() => handleRemove(user)}>
                        Remove
                    </InviteButton>
                    }
                    </MemberCard>
                ))}


                </UsersList>
            </AddMember>
          
            <ButtonContainer>
                <OutlinedBox
                button={true}
                activeButton={false}
                style={{ marginTop: "18px", width: "100%" }}
                onClick={() => {
                    !backDisabled && goToAddTeam();
                }}
                >
                Back
                </OutlinedBox>
                <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: "18px", width: "100%" }}
                onClick={() => {
                    !disabled && CreateTeam();
                }}
                >
                {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                ) : (
                    "Create Team"
                )}
                </OutlinedBox>
            </ButtonContainer>
            </>
        )}
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default AddNewTeam;
