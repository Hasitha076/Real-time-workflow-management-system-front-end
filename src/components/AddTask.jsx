import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { CloseRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import { Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import axios from "axios";

const Container = styled.div`
  padding: 12px 14px;
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
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Task = styled.div`
  margin: 12px 0px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 0px;
`;

const TextBtn = styled.div`
  flex: 0.6;
  font-size: 12px;
  font-weight: 500;
  color: #0094ea;
  &:hover {
    color: #0094ea99;
  }
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

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  font-family: "Poppins", sans-serif;
  padding: 8px 0px;
  color: ${({ theme }) => theme.textSoft};
`;
const OutlinedBox = styled.div`
  min-height: 34px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
  font-weight: 600;
  height: 38px;
    background: ${theme.soft};
    color:'${theme.soft2}';`}
  ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
  height: 38px;
    background: ${theme.primary};
    color: white;`}
  margin: 6px 0px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 10px;
`;
const FlexDisplay = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  justify-content: center;
`;

const Body = styled.div`
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

const UsersList = styled.div`
  padding: 18px 8px;
  display: flex;
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

const AddMember = styled.div`
  margin: 22px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgDark + "98"};
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

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 12px 20px 0px 20px;
`;


const Role = styled.div`
  background-color: ${({ theme }) => theme.bgDark};
  border-radius: 12px;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 12px 100px;
  align-items: center;
  justify-content: space-between;
`;

const OutlinedButtonBox = styled.div`
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

const AddTask = ({ WorkMembers, ProjectId, WorkId, WorkTeams, data }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectMember, setSelectMember] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const token = localStorage.getItem("token");

  const goToNextpage = () => {
    if (!taskName || !description) {
      alert("Please fill all the fields");
      return;
    } else {
      setStep(step + 1);
    }
  };
  
  //create new work card
  const createTaskCard = async (ProjectId, WorkId, currentUser) => {
 
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

    
    await axios.post("http://localhost:8082/api/v1/task/createTask", newTaskCard,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is included
          "Content-Type": "application/json",
        },
        withCredentials: true, // Important for session-based auth
      }
    )
      .then(() => {
        setLoading(false);
        emptyForm();

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

  return (
    <Container className={"item"}>
      {step === 0 && (
        <>
          <Top>
            <Title>Create new task</Title>
          </Top>
          <OutlinedBox style={{ marginTop: "8px" }}>
            <TextInput
              placeholder="Title task"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </OutlinedBox>
          <OutlinedBox>
            <TextArea
              placeholder="What is the new task about?"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </OutlinedBox>
          <OutlinedBox>
            <TextArea
              placeholder="Tags seperated by comma"
              name="tags"
              rows={2}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </OutlinedBox>
          <OutlinedBox
            button
            activeButton
            style={{ marginTop: "14px" }}
            onClick={() => goToNextpage()}
          >
            Next
          </OutlinedBox>
        </>
      )}
      {step === 1 && (
        <>
          <Top>
            <Title>Create new task</Title>
          </Top>
          {/* {task.map((task, index) => ( */}
            <Task>
              <FlexDisplay>
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
                      fontSize: "12px",
                      backgroundColor: "transparent",
                      color: "#fff",
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
                    id="start"
                    name="start_date"
                    style={{ fontSize: "12px" }}
                    placeholder="Start date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </OutlinedBox>
              </FlexDisplay>
              <Bottom>
            
                <TextBtn
                  style={{ padding: "6px", textAlign: "end" }}
                  onClick={() => setSelectMember(true)}
                >
                  Add member
                </TextBtn>
              </Bottom>
              
            </Task>
      
          <Modal open={selectMember} onClose={() => setSelectMember(false)}>
            <Wrapper>
              <Body>
                <FlexDisplay>
                  <IconButton
                    style={{
                      position: "absolute",
                      right: "10px",
                      cursor: "pointer",
                      color: "inherit",
                    }}
                    onClick={() => setSelectMember(false)}
                  >
                    <CloseRounded style={{ color: "inherit" }} />
                  </IconButton>
                  <Title style={{ paddingLeft: "10px" }}>Select member</Title>
                </FlexDisplay>

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
                        <OutlinedButtonBox
                          button={true}
            
                          style={{ width: "100%" }}
                          onClick={() => {
                            setSelectMember(false);
                        

                          }}
                        >
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            "Add collaborators"
                          )}
                        </OutlinedButtonBox>
                      </ButtonContainer>
              </Body>
            </Wrapper>
          </Modal>

          <FlexDisplay>
            <OutlinedBox
              button
              style={{ width: "100%" }}
              onClick={() => setStep(step - 1)}
            >
              Back
            </OutlinedBox>
            <OutlinedBox
              button
              activeButton
              style={{ width: "100%" }}
              onClick={() => createTaskCard(ProjectId, WorkId, currentUser)}
            >
              {loading ? <CircularProgress size={20} /> : "Create"}
            </OutlinedBox>
          </FlexDisplay>
        </>
      )}
    </Container>
  );
};

export default AddTask;
