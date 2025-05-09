import { IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {
  CloseRounded
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
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
`;

const Wrapper = styled.div`
  width: 100%;
  height: min-content;
  margin: 2%;
  max-width: 600px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px 0;
  text-transform: uppercase;
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
  margin: 0;
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
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 0;
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
  gap: 15px;
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
  height: 120px;
  overflow-y: auto;
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
  width: 200px;
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
  text-align: center;
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

const FlexDisplay = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;


const UpdateTaskTemplate = ({ setTaskTemplateUpdated, setUpdateTaskTemplate, templateDetails }) => {
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [backDisabled, setBackDisabled] = useState(false);
  const [showAddProject, setShowAddProject] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const {currentUser} = useSelector((state) => state.user);

  const goToAddProject = () => {
    setShowAddProject(true);
    setShowAddMember(false);
  };


  const goToAddMember = () => {
    setShowAddProject(false);
    setShowAddMember(true);
  };

  //add member part
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const[availableUsers, setAvailableUsers] = useState([]);
  const[availableTeams, setAvailableTeams] = useState([]);
  const [inputs, setInputs] = useState({ 
        taskTemplateId: templateDetails.taskTemplateId,
      taskTemplateName: templateDetails.taskTemplateName,
      taskTemplateDescription: templateDetails.taskTemplateDescription,
      taskTemplateTags: templateDetails.taskTemplateTags,
      taskTemplatePriority: templateDetails.taskTemplatePriority,
      projectId: templateDetails.projectId,
      taskTemplateDueDate: templateDetails.taskTemplateDueDate,
      taskTemplateCollaboratorIds: templateDetails.taskTemplateCollaboratorIds,
      taskTemplateTeamIds: templateDetails.taskTemplateTeamIds,

    });

    const getAllUsers = async () => {
        await axios.get("http://localhost:8081/api/v1/user/getAllUsers")
        .then((res) => {
          setAvailableUsers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    
      const getAllTeams = async () => {
        const response = await axios.get("http://localhost:8085/api/v1/team/getAllTeams")
        const data = response.data;
          setAvailableTeams(data);
    
      }
    
      useEffect(() => {
        getAllUsers();
        getAllTeams();
      }, [templateDetails]);


      useEffect(() => {
        console.log("happened");
        
        if (templateDetails) {
          if (templateDetails.taskTemplateCollaboratorIds?.length && availableUsers.length) {
            const matchingUsers = availableUsers
            .filter((user) => templateDetails.taskTemplateCollaboratorIds.includes(user.userId))
            .map(({ userId, userName, email }) => ({ 
                id: userId, 
                name: userName, 
                email 
            }));

            console.log("Matching Users: ", matchingUsers);
            setSelectedUsers(matchingUsers);

          } else {
            setSelectedUsers([]); // Clear selection if no matching users
          }
      
          if (templateDetails.taskTemplateTeamIds?.length && availableTeams.length) {
            const matchingTeams = availableTeams
              .filter((team) => templateDetails.taskTemplateTeamIds.includes(team.teamId))
              .map(({ teamId, teamName }) => ({ id: teamId, name: teamName }));
            console.log("Matching Teams: ", matchingTeams);
            setSelectedTeam(matchingTeams);
          } else {
            setSelectedTeam([]); // Clear selection if no matching teams
          }
        }
      }, [templateDetails, availableUsers, availableTeams]);
      

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

  const handleChange = (e) => {
    setInputs((prev) => {
      if (e.target.name === "taskTemplateTags") {
        return { ...prev, [e.target.name]: e.target.value.split(",") };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  };

  const UpdateTaskTemplate = async () => {
    setLoading(true);
    setDisabled(true);

      await axios.put("http://localhost:8082/api/v1/task/updateTaskTemplate", {
        taskTemplateId: inputs.taskTemplateId,
        taskTemplateName: inputs.taskTemplateName,
        taskTemplateDescription: inputs.taskTemplateDescription,
        taskTemplateTags: inputs.taskTemplateTags,
        taskTemplatePriority: inputs.taskTemplatePriority,
        assignerId: currentUser.userId,
        projectId: parseInt(inputs.projectId),
        taskTemplateStatus: false,
        taskTemplateDueDate: inputs.taskTemplateDueDate,
        taskTemplateCollaboratorIds: selectedUsers.map((user) => user.id),
        taskTemplateTeamIds: selectedTeam.map((team) => team.id)
      })
        .then((res) => {

          setLoading(false);
          setUpdateTaskTemplate(false);
          setTaskTemplateUpdated(true);
          dispatch(
            openSnackbar({
              message: "Task template update successfully",
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

  const getAvailableTeams = async () => {
    const response = await axios.get("http://localhost:8085/api/v1/team/getAllTeams")
    const data = response.data;
      setAvailableTeams(data);

  }

  useEffect(() => {
    getAvailableUsers();
    getAvailableTeams();
    if (templateDetails.taskTemplateName === "" || templateDetails.taskTemplateDescription === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [inputs]);

  const dispatch = useDispatch();

  return (
    <Modal open={true} onClose={() => setUpdateTaskTemplate(false)}>
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
            onClick={() => setUpdateTaskTemplate(false)}
          >
            <CloseRounded style={{ color: "inherit" }} />
          </IconButton>
          <Title>Update task template</Title>

          {showAddProject && (
            <>
              <Label>Task Details :</Label>
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  placeholder="Name"
                  type="text"
                  name="taskTemplateName"
                  value={inputs.taskTemplateName}
                  onChange={handleChange}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Description"
                  name="taskTemplateDescription"
                  rows={5}
                  value={inputs.taskTemplateDescription}
                  onChange={handleChange}
                />
              </OutlinedBox>

              <FlexDisplay style={{ marginTop: "6px" }}>
                <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                  <select
                    id="taskTemplatePriority"
                    name="taskTemplatePriority"
                    value={inputs.taskTemplatePriority}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0",
                      border: "1px solid rgb(193 199 201 / 50%)",
                      borderRadius: "4px",
                      fontSize: "16px",
                      backgroundColor: "transparent",
                      color: "rgb(193 199 201 / 50%)",
                      border: "none",
                    }}
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                  <TextInput
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    id="taskTemplateDueDate"
                    name="taskTemplateDueDate"
                    style={{ fontSize: "16px" }}
                    placeholder="Due Date"
                    value={inputs.taskTemplateDueDate}
                    onChange={handleChange}
                  />
                </OutlinedBox>
              </FlexDisplay>



              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                  name="taskTemplateTags"
                  rows={4}
                  value={inputs.taskTemplateTags}
                  onChange={handleChange}
                />
              </OutlinedBox>

              <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: "22px", marginBottom: "18px" }}
                onClick={() => {
                  !disabled && goToAddMember();
                }}
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
                  {availableUsers.map((user) => ( user.role != "GUEST" && user.role != "USER" &&
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

               <Label>Add Teams :</Label>
                              
                <AddMember>
      
                <UsersList>
                  {availableTeams.map((team) => (
                      <MemberCard key={team.id}>
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
      
                </AddMember>

              <ButtonContainer>
                <OutlinedBox
                  button={true}
                  activeButton={false}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !backDisabled && goToAddProject();
                  }}
                >
                  Back
                </OutlinedBox>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !disabled && UpdateTaskTemplate();
                  }}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Update template"
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

export default UpdateTaskTemplate;
