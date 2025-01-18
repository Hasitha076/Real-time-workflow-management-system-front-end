import { CloseRounded } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;

const Wrapper = styled.div`
  width: 550px;
  height: auto;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 10px;
  display: flex;
  margin-top: 0;
  flex-direction: column;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px;
`;

const Search = styled.div`
  margin: 6px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
  background-color: ${({ theme }) => theme.bgDark};
`;

const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 100px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const UsersList = styled.div`
  padding: 18px 8px;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
  height: 130px;
  overflow-y: auto;
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  @media (max-width: 768px) {
    gap: 6px;
  }
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
  width: 200px;
  word-wrap: break-word;
  color: ${({ theme }) => theme.textSoft};
`;

const EmailId = styled.div`
  font-size: 10px;
  font-weight: 400;
  width: 200px;
  word-wrap: break-word;
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

const Access = styled.div`
padding: 6px 10px;
border-radius: 12px;
display: flex;
align-items: center;
justify-content: center;
background-color: ${({ theme }) => theme.bgDark};
`;

const Select = styled.select`
  border: none;
  font-size: 12px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgDark};
`;

const Role = styled.div`
  background-color: ${({ theme }) => theme.bgDark};
  border-radius: 12px;
  font-size: 12px;
`;

const InviteButton = styled.button`
  padding: 6px 8px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 1px;
  font-weight: 500;
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

const AddMember = styled.div`
  margin: 22px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgDark + "98"};
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
  cursor: pointer;
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
  &:hover {
    transition: all 0.6s ease-in-out;
    background: ${({ theme }) => theme.soft};
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 12px 100px;
  align-items: center;
  justify-content: space-between;
`;

const InviteWorkMembers = ({ setInvitePopup, id, teamInvite, data, projectCollaboratorIds, projectTeamIds, workCollaborators, workTeams }) => {

  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [availableusers, setAvailableUsers] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const dispatch = useDispatch();

  const UpdateProjectCollaborators = async () => {
    setLoading(true);

      if(selectedUsers.length > 0 || selectedTeam.length > 0){
        await axios.put(`http://localhost:8086/api/v1/work/updateCollaborators/${id}`, {
          collaboratorIds: selectedUsers.map((user) => user.id),
          teamIds: selectedTeam.map((team) => team.id)
        })
          .then(() => {
            // setSelectedUsers([]);
            // setSelectedTeam([]);
            setLoading(true);
            setInvitePopup(false);
            dispatch(
              openSnackbar({
                message: "Work collaborators updated successfully",
                type: "success",
              })
            );
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            dispatch(
              openSnackbar({
                message: "Something went wrong",
                type: "error",
              })
            );
          });
      } else {
        dispatch(
          openSnackbar({
            message: "Select atleast one user or team",
            type: "error",
          })
        );
      }
    
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

  const getAvailableTeams = async () => {
    const response = await axios.get("http://localhost:8085/api/v1/team/getAllTeams")
    const data = response.data;
      setAvailableTeams(data);

  }

    useEffect(() => {
      getAvailableUsers();
      getAvailableTeams();
    }, []);
    

    useEffect(() => {

    
      if (data?.collaboratorIds && workCollaborators.length > 0) {
        const matchingUsers = workCollaborators.filter((user) =>
            data.collaboratorIds.includes(user.id)
        ).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));
    
        setSelectedUsers(matchingUsers);
      }

    
      if (data?.teamIds && workTeams.length > 0) {
        const matchingTeams = workTeams.filter((team) =>
          data.teamIds.includes(team.id)
        ).map((team) => ({
          id: team.id,
          name: team.name
        }));
    
        setSelectedTeam(matchingTeams);
      }

      
    }, [data, workCollaborators, workTeams]);
        
   

       //Add members from selected users
  const handleSelect = (user) => {
    const User = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    
    if (selectedUsers.find((u) => u.id === User.id)) {
    } else {
      setSelectedUsers([...selectedUsers, {
        id: user.id,
        name: user.name,
        email: user.email,
      }]);
    }
  };

    //Add team from selected teams
  const handleSelectTeam = (team) => {
    const Team = {
      id: team.id,
      name: team.name
    };
    if (selectedTeam.find((t) => t.id === Team.teamId)) {
    } else {
      setSelectedTeam([...selectedTeam, {
        id: team.id,
        name: team.name
      }]);
    }
  };

  //remove members from selected users
  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

    //remove teams from selected users
  const handleRemoveTeam = (team) => {
    setSelectedTeam(selectedTeam.filter((t) => t.id !== team.id));
  };
  
    
  console.log(id);
  console.log("In work: ",data);
  console.log(data.collaboratorIds);
  console.log(data.teamIds);
  console.log(selectedUsers);
  console.log(selectedTeam);
  console.log("Work Collaborators: ",workCollaborators);
  console.log("Work Teams: ",workTeams);
  console.log("Project Collaborators: ",projectCollaboratorIds);
  console.log("Project Teams: ",projectTeamIds);

  return (
    <Modal open={true} onClose={() => setInvitePopup(false)}>
      <Container>
        <Wrapper>
          <>
          <CloseRounded
            sx={{ fontSize: "22px" }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
            }}
            onClick={() => setInvitePopup(false)}
          />
          <Label>Add Members :</Label>
          
          <AddMember>

            <UsersList>
              {workCollaborators.map((user) => (
                <MemberCard>
                  <UserData>
                    <Avatar
                      sx={{ width: "34px", height: "34px" }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Details>
                      <Name>{user.name}</Name>
                      <EmailId>{user.email}</EmailId>
                    </Details>
                  </UserData>
                  <Flex>
                    <Role>{user.role}</Role>

                  </Flex>
                  {
                    !selectedUsers.find((u) => u.id === user.id) && 
                    <InviteButton onClick={() => handleSelect(user)}>
                    Add
                    </InviteButton>
                  }
                  {
                    selectedUsers.find((u) => u.id === user.id) && 
                    <InviteButton onClick={() => handleRemove(user)}>
                    Remove
                  </InviteButton>
                  }
                </MemberCard>
              ))}


            </UsersList>
          </AddMember>

          <Label>Add Teams :</Label>

          <AddMember>

          <UsersList>
            {workTeams.map((team) => (
                <MemberCard key={team.teamId}>
                  <UserData>
                    <Avatar sx={{ width: "34px", height: "34px" }}>
                    {team.name.charAt(0)}
                    </Avatar>
                    <Details>
                      <Name>{team.name}</Name>
                    </Details>
                  </UserData>
                  {
                    !selectedTeam.find((t) => t.id === team.id) && 
                    <InviteButton onClick={() => handleSelectTeam(team)}>
                    Add
                    </InviteButton>
                  }
                  {
                    selectedTeam.find((t) => t.id === team.id) && 
                    <InviteButton onClick={() => handleRemoveTeam(team)}>
                    Remove
                  </InviteButton>
                  }
                </MemberCard>
              ))}
          </UsersList>

          </AddMember>
          {message && <div style={{ color: "red" }}>{message}</div>}

          <ButtonContainer>
            <OutlinedBox
              button={true}

              style={{ width: "100%" }}
              onClick={() => {
                UpdateProjectCollaborators();
              }}
            >
              {Loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Add collaborators"
              )}
            </OutlinedBox>
          </ButtonContainer></>

        </Wrapper>
      </Container>
    </Modal>
  );
};

export default InviteWorkMembers;
