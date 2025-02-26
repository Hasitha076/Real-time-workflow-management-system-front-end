import React, { useEffect } from "react";
import { Fragment, useState, useRef } from "react";
import styled from "styled-components";
import { CloseRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import { Modal } from "@mui/material";
// import { addWorks } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import axios from "axios";
import { UPDATE_PROJECT, UPDATE_PROJECT_STATUS } from "../GraphQL/Queries";
import { useMutation } from "@apollo/client";

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
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
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

const Members = styled.div`
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
`;
const MemberGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.soft};
  padding: 4px 4px;
  gap: 1px;
  border-radius: 100px;
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
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

const AddWork = ({ ProjectMembers, ProjectId, setCreated, ProjectTeams, memberIcons, data, setWorkAdded, workCount }) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectMember, setSelectMember] = useState(false);

  const [workName, setWorkName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

 const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);

  //tasks
  // const [task, setTask] = useState([
  //   {
  //     task: "",
  //     start_date: "",
  //     end_date: "",
  //     members: [],
  //   },
  // ]);

  // const handleTaskChange = (index, event) => {
  //   let data = [...task];
  //   data[index][event.target.name] = event.target.value;
  //   setTask(data);
  // };

  const goToNextpage = () => {
    if (!workName || !description) {
      alert("Please fill all the fields");
      return;
    } else {
      setStep(step + 1);
    }
  };

  // const addTasks = () => {
  //   let newfield = { task: "", start_date: "", end_date: "", members: [] };
  //   setTask([...task, newfield]);
  // };

  // const deleteTasks = (index) => {
  //   let data = [...task];
  //   data.splice(index, 1);
  //   setTask(data);
  // };

  //task member
  // const addMember = (index) => {
  //   setSelectMember(true);
  //   setTaskIndex(index);
  // };

  // const removeMember = (index, memberIndex) => {
  //   let data = [...task];
  //   data[index].members.splice(memberIndex, 1);
  //   setTask(data);
  // };

  // const AddToMember = (member, index) => {
  //   //if member exist dont add

  //   if (task[index].members.find((item) => item.id === member.id._id)) return;

  //   let data = [...task];
  //   data[index].members.push({ id: member.id._id, img: member.id.img });

  //   setTask(data);
  // };

  console.log(ProjectId);

  const updateProject = async () => {
    console.log(ProjectId);

    await axios.get(`http://localhost:8086/api/v1/work/getWorksByProjectId/${ProjectId}`).then((res) => {
      if(res.data.length > 0 || res.data.every((work) => work.status === false)) {
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
      } 
    })
  };
  

  //create new work card
  const createWorkCard = async (ProjectId) => {

    let newWorkCard = {
      workName,
      description,
      tags: tags.split(","),
      priority,
      projectId: ProjectId,
      dueDate,
      collaboratorIds: selectedUsers.map((user) => user.id),
      teamIds: selectedTeam.map((team) => team.id)
    };

    console.log(newWorkCard);

    
    await axios.post("http://localhost:8086/api/v1/work/createWork", newWorkCard)
      .then(() => {
        setLoading(false);
        emptyForm();
        setWorkAdded(true);
        updateProject();
        dispatch(
          openSnackbar({
            message: "Created a work card Successfully",
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
    setWorkName("");
    setDescription("");
    setTags("");

  
    setStep(0);
  };

  const [availableusers, setAvailableUsers] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const getAvailableUsers = async () => {
    await axios.get("http://localhost:8081/api/v1/user/getAllUsers")
    .then((res) => {
      const filterData = res.data.filter((item) => 
        ProjectMembers.includes(item.userId));
      setAvailableUsers(filterData);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const getAvailableTeams = async () => {
    await axios.get("http://localhost:8085/api/v1/team/getAllTeams")
    .then((res) => {
      console.log(res.data);
      
      const filterData = res.data.filter((item) => 
        ProjectTeams.includes(item.teamId));
      setAvailableTeams(filterData);
    })
    .catch((err) => {
      console.log(err);
    });

  }

    useEffect(() => {
      getAvailableUsers();
      getAvailableTeams();
    }, [data, ProjectMembers, ProjectTeams]);

      console.log(data);
      
      console.log(availableusers);
      console.log(availableTeams);
      console.log(selectedUsers);
      console.log(selectedTeam);
      

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

  console.log(selectedUsers);
  console.log(selectedTeam);

  return (
    <Container className={"item"}>
      {step === 0 && (
        <>
          <Top>
            <Title>Create new work</Title>
          </Top>
          <OutlinedBox style={{ marginTop: "8px" }}>
            <TextInput
              placeholder="Title card"
              type="text"
              value={workName}
              onChange={(e) => setWorkName(e.target.value)}
            />
          </OutlinedBox>
          <OutlinedBox>
            <TextArea
              placeholder="What is the new work about?"
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
            <Title>Create new work</Title>
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
                {/* <Members>
                  {task.members.map((member, memberIndex) => (
                    <MemberGroup>
                      <Avatar
                        sx={{ width: "20px", height: "20px" }}
                        src={member.img}
                      />
                      <CloseRounded
                        onClick={() => removeMember(index, memberIndex)}
                        style={{ fontSize: "18px" }}
                      />
                    </MemberGroup>
                  ))}
                </Members> */}
                <TextBtn
                  style={{ padding: "6px", textAlign: "end" }}
                  onClick={() => setSelectMember(true)}
                >
                  Add member
                </TextBtn>
              </Bottom>
              {/* <TextBtn
                style={{
                  marginLeft: "2px",
                  marginBottom: "10px",
                  marginTop: "4px",
                  color: "#ff4444",
                }}
                onClick={() => deleteTasks(index)}
              >
                Remove Task
              </TextBtn> */}
            </Task>
          {/* ))} */}
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

                {/* <UsersList>
                  {selectedUsers.map((user) => (
                    <MemberCard>
                      <UserData>
                        <Avatar
                          sx={{ width: "34px", height: "34px" }}
                          // src={user.id.img}
                        >
                          {user.userName.charAt(0)}
                        </Avatar>
                        <Details>
                          <Name>{user.userName}</Name>
                          <EmailId>{user.email}</EmailId>
                        </Details>
                      </UserData>
                      {!task[taskIndex].members.find(
                        (member) => member.id === user.id._id
                      ) && (
                        <InviteButton
                          onClick={() => AddToMember(user, taskIndex)}
                        >
                          Add
                        </InviteButton>
                      )}
                    </MemberCard>
                  ))}
                </UsersList> */}

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
                          </AddMember>
                
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
                
                          </AddMember>
                          {/* {!task[taskIndex].members.find(
                        (member) => member.id === user.id._id
                      ) && (
                        <InviteButton
                          onClick={() => AddToMember(taskIndex)}
                        >
                          Add
                        </InviteButton>
                      )} */}

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
          {/* <OutlinedBox
            button
            activeButton
            style={{ height: "30px", backgroundColor: "#0094ea" }}
            onClick={() => addTasks()}
          >
            Add task
          </OutlinedBox> */}

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
              onClick={() => createWorkCard(ProjectId)}
              // onClick={() => setStep(step + 1)}
            >
              {loading ? <CircularProgress size={20} /> : "Create"}
            </OutlinedBox>
          </FlexDisplay>
        </>
      )}
    </Container>
  );
};

export default AddWork;
