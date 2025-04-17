import { IconButton, Modal, Snackbar } from "@mui/material";
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
import { UPDATE_PROJECT_STATUS } from "../GraphQL/Queries";
import { useMutation } from "@apollo/client";

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


const AddNewTask = ({ setNewTask, WorkMembers, WorkTeams, ProjectId, WorkId, data, setTaskAdd, tasks, currentUser }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
    const [disabled, setDisabled] = useState(true);
      const [backDisabled, setBackDisabled] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [selectMember, setSelectMember] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
    const [showAddTask, setShowAddTask] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);

     const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);

  const goToNextpage = () => {
    if (!taskName || !description) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    goToNextpage();
  }, [taskName, description]);

  const goToAddTask = () => {
    setShowAddTask(true);
    setShowAddMember(false);
  };

  const goToAddMember = () => {
    setShowAddTask(false);
    setShowAddMember(true);
  };

  
  
  //create new work card
  const createTaskCard = async () => {
 
    let newTaskCard = {
      taskName,
      description,
      tags: tags.split(","),
      priority,
      assignerId: currentUser.userId,
      projectId: ProjectId,
      workId: WorkId,
      dueDate,
      collaboratorIds: selectedUsers.map((user) => user.id),
      teamIds: selectedTeam.map((team) => team.id)
    };

    await axios.post("http://localhost:8082/api/v1/task/createTask", newTaskCard)
      .then(() => {
        setLoading(false);
        emptyForm();
        setNewTask(false);
        setTaskAdd(true);

        axios.put(`http://localhost:8086/api/v1/work/updateWork`, {
            workId: data.workId, 
            workName: data.workName, 
            description: data.description, 
            priority: data.priority,
            projectId: data.projectId,
            dueDate: data.dueDate,
            collaboratorIds: data.collaboratorIds,
            teamIds: data.teamIds,
            memberIcons: data.memberIcons,
            status: false,
            tags: data.tags
        }).then(() => {
          updateProjectStatus({
            variables: {
              projectId: parseInt(ProjectId),
              input: {
                status: "ON_GOING"
              }
            }
          }).then((res) => {
            console.log(res);
          }).catch((err) => {
              console.log(err);
              setLoading(false);
          });
        })


        dispatch(
          openSnackbar({
            message: "Created a task card Successfully",
            severity: "success",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
        setLoading(false);
      });
  };

  const emptyForm = () => {
    setTaskName("");
    setDescription("");
    setTags("");

  
    setStep(0);
  };
      

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


  console.log(data);
  console.log(selectedUsers);
  console.log(selectedTeam);
  console.log(ProjectId);
  console.log(WorkMembers);
  console.log(WorkTeams);

  return (
    <Modal open={true} onClose={() => setNewTask(false)}>
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
            onClick={() => setNewTask(false)}
          >
            <CloseRounded style={{ color: "inherit" }} />
          </IconButton>
          <Title>Create a new Task</Title>

          {showAddTask && (
            <>
              <Label>Task Details :</Label>
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  placeholder="Name (Required)*"
                  type="text"
                  name="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Description (Required)* "
                  name="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </OutlinedBox>

              <FlexDisplay style={{ marginTop: "6px" }}>
                <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                  <select
                    id="priority"
                    name="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                      backgroundColor: "transparent",
                      color: "#C1C7C9",
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
                    id="dueDate"
                    name="dueDate"
                    style={{ fontSize: "16px" }}
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </OutlinedBox>
              </FlexDisplay>



              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                  name="tags"
                  rows={4}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
                  {WorkMembers.map((user) => (
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
                  {WorkTeams.map((team) => (
                      <MemberCard key={team.id}>
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

              <ButtonContainer>
                <OutlinedBox
                  button={true}
                  activeButton={false}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !backDisabled && goToAddTask();
                  }}
                >
                  Back
                </OutlinedBox>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !disabled && createTaskCard();
                  }}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Create Task"
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

export default AddNewTask;
