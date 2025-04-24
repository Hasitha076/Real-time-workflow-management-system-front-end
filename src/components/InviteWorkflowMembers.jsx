import { CloseRounded } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
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

const UsersList = styled.div`
  padding: 18px 8px;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
  height: 100%;
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

const InviteWorkflowMembers = ({ inviteMemberPopup, setInviteMemberPopup, inviteTeamPopup, setInviteTeamPopup, data, workDetails }) => {

  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const [collaboratorBlock, setCollaboratorBlock] = useState({});
  const [definedCollaborators, setDefinedCollaborators] = useState([]);

  const getCollaboratorsBlock = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getCollaboratorsBlock/${workDetails.workId}`)
    .then((res) => {
      setDefinedCollaborators(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  useEffect(() => {
    getCollaboratorsBlock();
  }, []);

  const workCollaboratorsTemplate = async () => {
    try {
        setLoading(true);

        let collaboratorBlock = null;

        // Fetch the existing collaborators block
        try {
            const res = await axios.get(`http://localhost:8082/api/v1/task/getCollaboratorsBlock/${workDetails.workId}`);
            if (res.status === 200) {
                collaboratorBlock = res.data;
                console.log("Existing block found:", collaboratorBlock);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No collaborators block found, creating a new one.");
            } else {
                throw error; // Unexpected error
            }
        }

        // If no existing block, create a new one
        if (!collaboratorBlock) {
            await axios.post(`http://localhost:8082/api/v1/task/createCollaboratorsBlock`, {
                projectId: workDetails.projectId,
                workId: workDetails.workId,
                memberIds: selectedUsers.length > 0 ? selectedUsers.map((user) => user.id) : [],
                teamIds: selectedTeam.length > 0 ? selectedTeam.map((team) => team.id) : []
            }).then(() => {
                dispatch(
                    openSnackbar({
                        message: "Task collaborators template created successfully",
                        type: "success",
                    })
                );

                setLoading(false);
                setInviteMemberPopup(false);
            })

            
        } else {
            // Update the existing block

            await axios.put(`http://localhost:8082/api/v1/task/updateCollaboratorsBlock`, {
                collaboratorsBlockId: collaboratorBlock.collaboratorsBlockId,
                projectId: collaboratorBlock.projectId,
                workId: collaboratorBlock.workId,
                memberIds: selectedUsers.length > 0 ? selectedUsers.map((user) => user.id) : [],
                teamIds: selectedTeam.length > 0 ? selectedTeam.map((team) => team.id) : []
            }).then((res) => {
              console.log(res.data);
              
                dispatch(
                    openSnackbar({
                        message: "Task collaborators template updated successfully",
                        type: "success",
                    })
                );

                setLoading(false);
                setInviteMemberPopup(false);
                setInviteTeamPopup(false);
            })

        }


    } catch (err) {
        setLoading(false);
        dispatch(
            openSnackbar({
                message: "Something went wrong",
                type: "error",
            })
        );
    }
};

  const dispatch = useDispatch();
  const [availableusers, setAvailableUsers] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

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

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);


    useEffect(() => {
      if (definedCollaborators?.memberIds?.length && availableusers.length) {
        const existingCollaborators = definedCollaborators.memberIds
          .map((id) => availableusers.find((user) => user.userId === id))
          .filter(Boolean) // Removes null values
          .map((user) => ({
            id: user.userId,
            name: user.userName,
            email: user.email,
          }));
    
        setSelectedUsers(existingCollaborators);
      }
    
      if (definedCollaborators?.teamIds?.length && availableTeams.length) {
        const existingTeams = definedCollaborators.teamIds
          .map((id) => availableTeams.find((team) => team.teamId === id))
          .filter(Boolean) // Removes null values
          .map((team) => ({
            id: team.teamId,
            name: team.teamName,
          }));
    
        setSelectedTeam(existingTeams);
      }
    }, [definedCollaborators, availableusers, availableTeams]);
    

  //Add members from selected users
  const handleSelect = (user) => {
    const User = {
      id: user.userId,
      name: user.name,
      email: user.email,
    };
    
    if (selectedUsers.find((u) => u.id === User.id)) {
    } else {
      setSelectedUsers([...selectedUsers, {
        id: user.userId,
        name: user.userName,
        email: user.email,
      }]);
    }
  };

    //Add team from selected teams
  const handleSelectTeam = (team) => {
    const Team = {
      id: team.teamId,
      name: team.teamName
    };
    if (selectedTeam.find((t) => t.id === Team.teamId)) {
    } else {
      setSelectedTeam([...selectedTeam, {
        id: team.teamId,
        name: team.teamName
      }]);
    }
  };

  //remove members from selected users
  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.userId));
  };

    //remove teams from selected users
  const handleRemoveTeam = (team) => {
    setSelectedTeam(selectedTeam.filter((t) => t.id !== team.teamId));
  };

  return (
    <Modal open={true} onClose={() => setInviteMemberPopup(false)}>
      <Container>
        <Wrapper>
          <>
          {inviteMemberPopup && <CloseRounded
            sx={{ fontSize: "22px" }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
            }}
            onClick={() => setInviteMemberPopup(false)}
          />}
          {inviteTeamPopup && <CloseRounded
            sx={{ fontSize: "22px" }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
            }}
            onClick={() => setInviteTeamPopup(false)}
          />}
          {inviteMemberPopup && <>
            <Label>Add Members :</Label>
          
          <AddMember>

            <UsersList>
              {availableusers.map((user) => (
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
          </AddMember></>}

            {inviteTeamPopup && <>
                <Label>Add Teams :</Label>

<AddMember>

<UsersList>
  {availableTeams.map((team) => (
      <MemberCard key={team.teamId}>
        <UserData>
          <Avatar sx={{ width: "34px", height: "34px" }}>
            {team.teamName.charAt(0)}
          </Avatar>
          <Details>
            <Name>{team.teamName}</Name>
          </Details>
        </UserData>
        {
          !selectedTeam.find((t) => t.id === team.teamId) && 
          <InviteButton onClick={() => handleSelectTeam(team)}>
          Add
          </InviteButton>
        }
        {
          selectedTeam.find((t) => t.id === team.teamId) && 
          <InviteButton onClick={() => handleRemoveTeam(team)}>
          Remove
        </InviteButton>
        }
      </MemberCard>
    ))}
</UsersList>

</AddMember></>}
          {message && <div style={{ color: "red" }}>{message}</div>}

          <ButtonContainer>
            <OutlinedBox
              button={true}

              style={{ width: "100%" }}
              onClick={() => {
                workCollaboratorsTemplate();
              }}
            >
              {Loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : inviteMemberPopup ? (
                "Add collaborators"
              ) : (
                "Add Team"
              )}
            </OutlinedBox>
          </ButtonContainer></>

        </Wrapper>
      </Container>
    </Modal>
  );
};

export default InviteWorkflowMembers;
