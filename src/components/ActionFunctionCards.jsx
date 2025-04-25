import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import MoveUpIcon from '@mui/icons-material/MoveUp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from '@mui/material/Box';
import {Drawer, Slide} from '@mui/material';
import Divider from '@mui/material/Divider';
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {PersonAdd} from "@mui/icons-material";
import InviteActionMembers from "./InviteActionMember";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InviteRuleTaskMembers from "./InviteRuleTaskMembers";
import { useSelector } from "react-redux";


const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
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
  font-size: 25px;
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 6px;
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TaskMainText = styled.text`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  color: ${({ theme }) => theme.soft2};
  line-height: 2;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0px 14px 0px;
  text-align: left;
`;

const DrawerContainer = styled.div`
  padding: 30px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const Hr = styled.hr`
  margin: 18px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const ArrowIcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
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

const Members = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 8px 0px 0px 0px;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const InviteButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  border-radius: 10px;
  transition: all 0.3s ease;
  margin: 0px 16px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
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


const ActionFunctionCards = ({ works, activeAction, setActiveAction, projectId, setIsActiveAction, setIsActiveTrigger, existingRule }) => {

    const { currentUser } = useSelector((state) => state.user);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
    const [whichSection, setWhichSection] = useState(false);
    const [invitePopup, setInvitePopup] = useState(false);
    const [icons, setIcons] = useState([]);
    const [memberIcons, setMemberIcons] = useState([]);
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [option5, setOption5] = useState(works[0]);
    const [selectCollaboratorIds, setSelectCollaboratorIds] = useState([]);
    const [selectTeamIds, setSelectTeamIds] = useState([]);
    const [option6, setOption6] = useState({
        name: "",
        description: "",
        dueDate: "",
        collaboratorIds: [],
        teamIds: [],
        priority: "",
        tags: [],
        assignerId: currentUser.userId
    });
    const [isSetAssignee, setIsSetAssignee] = useState(true);
    const [selectedDate, setSelectedDate] = useState();

    const toggleActionDrawer = (newOpen, number) => () => {
        if(number === 1) {
            setOpen1(newOpen);
        }
        else if (number === 2) {
            setOpen2(newOpen);
        } 
        else if(number === 3) {
            setOpen3(newOpen);
        }
        else if(number === 4) {
            setOpen4(newOpen);
        }
        else if(number === 5) {
            setOpen5(newOpen);
        }
        else if(number === 6) {
            setOpen6(newOpen);
        }
        else if(number === 7) {
            setOpen7(newOpen);
        }
      };

  const eventHandle = (event) => {
    setIsActiveAction(true);
    setIsActiveTrigger(false);

    if(event === "Task moved") {
    setOpen1(true);
    }
    if(event === "Remove task") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Remove task from the project" } });
    }
    if(event === "Change assignee") {
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Set assignee to" } });
        setOpen3(true);
        setOption1("");
    }
    if(event === "Change status") {
        setOpen2(true);
    }
    if(event === "Change due date") {
        setOpen6(true);
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Change due date" } });
    }
    if(event === "Set task title") {
        setOpen4(true)
    }
    if(event === "Set task description") {
        setOpen5(true);
    }
    if(event === "Create task") {
        setOpen7(true);
    }
    if(event === "Create approvel") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Create approvel" } });
    }

  }

  const [assignee, setAssignee] = useState("");

    const handleChange = (event) => {
        setAssignee(event.target.value);
        if (event.target.value === "set_assignee") {
            setIsSetAssignee(true);
        } else {
            setIsSetAssignee(false);
            setActiveAction({ ...activeAction, actionDetails: { actionType: "Clear assignee" } });
            setIcons([]);
        }
        
    }

    const handleWorkChange = (event) => {
        try {
            const selectedWork = JSON.parse(event.target.value);
            const { workId, workName } = selectedWork;
    
            setOption1({ workId, workName });
            setActiveAction((prev) => ({
                ...prev,
                actionDetails: {
                    actionType: "Move task to section",
                    ActionMovedSection: { workId, workName },
                },
            }));
            setIcons([]);
        } catch (error) {
            console.error("Invalid selection:", error);
        }
    };
    

    const handleStatusChange = (event) => {
        setOption2(event.target.value);
        if (event.target.value === "complete_task") {
            setActiveAction({ ...activeAction, actionDetails: { actionType: "Complete task" } });
            setWhichSection(false);
        } else if (event.target.value === "incomplete_task") {
            setWhichSection(true);
            setActiveAction({ ...activeAction, actionDetails: { actionType: "Incomplete task"} });
            setIcons([]);
        } 
        
    }

    const handleTitleChange = (event) => {
        setOption3(event.target.value)
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Set task title", taskName: event.target.value } });
    }

    const handleDescriptionChange = (event) => {
        setOption4(event.target.value)
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Set task description", taskDescription: event.target.value } });
    }

    const handleDuedateChange = (event) => {
        setOpen6(event.target.value);
        if (event.target.value === "set_duedate") {
            setWhichSection(true);
        } else if (event.target.value === "clear_duedate") {
            setWhichSection(false);
            setActiveAction({ ...activeAction, actionDetails: { actionType: "Clear due date"} });
            setIcons([]);
        } 
        
    }

    const handleBlur = async (newValue) => {
        const formattedDate = dayjs(newValue);
        setSelectedDate(formattedDate)
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Set due date to", date: dayjs(newValue).format('YYYY-MM-DD') } });
    }

    const handleSelectWorkForTask = (event) => {
        const { workId, workName } = JSON.parse(event.target.value);
        setOption5({workId, workName});
        setIcons([]);
        
    }

    // onChange handler for text inputs, select, and tags
    const handleCreateTask = (event) => {
        const { name, value } = event.target;
        setOption6((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // onChange for DatePicker
    const handleTaskBlur = (newValue) => {
        setSelectedDate(newValue);
        setOption6((prev) => ({
            ...prev,
            dueDate: newValue.format("YYYY-MM-DD"),
        }));
    };

    // final submission function
    const createTaskCard = () => {

        setActiveAction({
            ...activeAction,
            actionDetails: {
                actionType: "Create task",
                task: {
                    ...option6,
                    collaboratorIds: selectCollaboratorIds,
                    teamIds: selectTeamIds,
                },
                whichSection: {
                    workId: option5.workId,
                    workName: option5.workName
                }


            },
        });

    };

    console.log("Active Action: ", activeAction);
    


  const DrawerActionList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleActionDrawer(false, 3)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '400px' }} role="presentation">
          <top>
            <h2 style={{ margin: '10px 0' }}>Set assignee to...</h2>
          </top>

          <Divider sx={{ padding: '10px 0' }} />

          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <p style={{ margin: '0' }}>Choose an option</p> 

            <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                  <select
                    id="priority"
                    name="priority"
                    value={assignee}
                    onChange={handleChange}
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
                      Set assignee to
                    </option>
                    <option value="set_assignee">Set Assignee to</option>
                    <option value="clear_assignee">Clear assignee</option>
                  </select>
                </OutlinedBox>

                <br />
                {isSetAssignee && 
                <>
                    <p style={{ margin: '0' }}>Choose an assignee</p> 

                    <Members>
                        {memberIcons.length != 0 ? <AvatarGroup>
          
                            <Avatar
                                sx={{ marginRight: "5px", width: "38px", height: "38px" }}
                            >
                                {memberIcons[0].name.charAt(0).toUpperCase()}
                            </Avatar>
                            {memberIcons[0].name}
                            
                        </AvatarGroup>  : <Avatar sx={{ backgroundColor: 'transparent', border: '1px dashed #000', color: '#000' }}><AccountCircleIcon/></Avatar>}
                        <InviteButton onClick={() => setInvitePopup(true)}>
                            <PersonAdd sx={{ fontSize: "12px" }} />
                            Invite
                        </InviteButton>
                    </Members>
                </>
                }

            <Hr />
            {invitePopup && (
              <InviteActionMembers
                setInvitePopup={setInvitePopup}
                id={projectId}
                memberIcons={memberIcons}
                setMemberIcons={setMemberIcons}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
              />
            )}

          </Box>

      </Box>
    </DrawerContainer>
  );


  const DrawerWorkList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleActionDrawer(false, 1)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '400px' }} role="presentation">
          <top>
            <h2 style={{ margin: '10px 0' }}>Task is moved to a section</h2>
          </top>

          <Divider sx={{ padding: '10px 0' }} />

            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <p style={{ margin: '0' }}>Choose a work</p> 

            <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
            <select
                id="work"
                name="work"
                value={JSON.stringify({ workId: option1.workId, workName: option1.workName })}
                onChange={(e) => handleWorkChange(e)}
                style={{
                width: "100%",
                padding: "0",
                borderRadius: "4px",
                fontSize: "16px",
                backgroundColor: "transparent",
                color: "#C1C7C9",
                border: "none",
                }}
            >
                <option value="" disabled>-</option>
                {works.map((work) => (
                <option
                    key={work.workId}
                    value={JSON.stringify({ workId: work.workId, workName: work.workName })}
                >
                    {work.workName}
                </option>
                ))}
            </select>
            </OutlinedBox>

          </Box>

      </Box>
    </DrawerContainer>
  );


  const DrawerActionStatusChange = (
          <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
            <ArrowIcoBtn onClick={toggleActionDrawer(false, 2)}>
              <KeyboardDoubleArrowRightIcon/>
            </ArrowIcoBtn>
            <Box sx={{ width: '400px' }} role="presentation">
                <top>
                  <h2 style={{ margin: '10px 0' }}>Complete task</h2>
                </top>
      
                <Divider sx={{ padding: '10px 0' }} />
      
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                  <p style={{ margin: '0' }}>Choose an option</p> 
      
                  <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                      <select
                      id="priority"
                      name="priority"
                      value={option2}
                      onChange={handleStatusChange}
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
                          Complete task
                      </option>
                      <option value="complete_task">Complete task</option>
                      <option value="incomplete_task">Mark task incomplete</option>
                      </select>
                  </OutlinedBox>
                </Box>
      
            </Box>
          </DrawerContainer>
        );


        const DrawerActionTitleChange = (
            <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
              <ArrowIcoBtn onClick={toggleActionDrawer(false, 4)}>
                <KeyboardDoubleArrowRightIcon/>
              </ArrowIcoBtn>
              <Box sx={{ width: '400px' }} role="presentation">
                  <top>
                    <h2 style={{ margin: '10px 0' }}>Set task title to</h2>
                  </top>
        
                  <Divider sx={{ padding: '10px 0' }} />
        
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                    <p style={{ margin: '0' }}>Task Name</p> 
        
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                        <TextInput
                        placeholder="Task Name"
                        type="text"
                        name="taskName"
                        value={option3}
                        onChange={handleTitleChange}
                        />
                    </OutlinedBox>
                  </Box>
        
              </Box>
            </DrawerContainer>
          );

          const DrawerActionDescriptionChange = (
            <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
              <ArrowIcoBtn onClick={toggleActionDrawer(false, 5)}>
                <KeyboardDoubleArrowRightIcon/>
              </ArrowIcoBtn>
              <Box sx={{ width: '400px' }} role="presentation">
                  <top>
                    <h2 style={{ margin: '10px 0' }}>Set task description to</h2>
                  </top>
        
                  <Divider sx={{ padding: '10px 0' }} />
        
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                    <p style={{ margin: '0' }}>Task Description</p> 
        
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                        <Desc
                        placeholder="Task Description"
                        type="text"
                        name="taskName"
                        value={option4}
                        onChange={handleDescriptionChange}
                        />
                    </OutlinedBox>
                  </Box>
        
              </Box>
            </DrawerContainer>
          );

          const DrawerActionDueDateChange = (
            <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
              <ArrowIcoBtn onClick={toggleActionDrawer(false, 6)}>
                <KeyboardDoubleArrowRightIcon/>
              </ArrowIcoBtn>
              <Box sx={{ width: '400px' }} role="presentation">
                  <top>
                    <h2 style={{ margin: '10px 0' }}>Set due date to</h2>
                  </top>
        
                  <Divider sx={{ padding: '10px 0' }} />
        
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                    <p style={{ margin: '0' }}>Choose on option</p> 
        
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                    <select
                      id="dueDate"
                      name="dueDate"
                      value={option2}
                      onChange={handleDuedateChange}
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
                        Set due date to
                      </option>
                      <option value="set_duedate">Set due date to</option>
                      <option value="clear_duedate">Clear due date</option>
                      </select>
                    </OutlinedBox>
                  </Box>
                    <br />
                  {whichSection && 

                       <>
                        <p style={{ margin: '0 0 15px 0' }}>Set due date</p> 
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={selectedDate}
                          onChange={handleBlur}
                            format="YYYY-MM-DD"
                            minDate={dayjs()} // Restricts selection to today and future dates
                        />
                        </LocalizationProvider>
                       </>
                     
                }
        
              </Box>
            </DrawerContainer>
          );


          const DrawerActionTaskCreate = (
            <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
              <ArrowIcoBtn onClick={toggleActionDrawer(false, 7)}>
                <KeyboardDoubleArrowRightIcon/>
              </ArrowIcoBtn>
              <Box sx={{ width: '400px' }} role="presentation">
                  <top>
                    <h2 style={{ margin: '10px 0' }}>Create task</h2>
                  </top>
        
                  <Divider sx={{ padding: '10px 0' }} />

                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                  
                  <p style={{ margin: '0' }}>Choose work to create task</p> 
                  <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                    <select
                    id="workId"
                    name="workId"
                    value={JSON.stringify(option5)}
                    onChange={handleSelectWorkForTask}
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
                        -
                    </option>
                    {works.map((work) => (
                        <option key={work.id} value={JSON.stringify({ workId: work.workId, workName: work.workName })}>
                        {work.workName}
                        </option>
                    ))}
                    </select>

                </OutlinedBox>
                  </Box>
                  
        
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
        
                    <p style={{ margin: '0' }}>Task Name</p> 
        
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                        <TextInput
                        placeholder="Task Name"
                        type="text"
                        name="name"
                        value={option6.name}
                        onChange={handleCreateTask}
                        />
                    </OutlinedBox>
        
                    <p style={{ margin: '0' }}>Task Description</p> 
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                        <Desc
                        placeholder="Task Description"
                        type="text"
                        name="description"
                        value={option6.description}
                        onChange={handleCreateTask}
                        />
                    </OutlinedBox>

                    <p style={{ margin: '0' }}>Task Priority</p> 
                    <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                      <select
                      id="priority"
                      name="priority"
                      value={option6.priority}
                      onChange={handleCreateTask}
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
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      </select>
                  </OutlinedBox>

                    <p style={{ margin: '0' }}>Set due date</p> 
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={selectedDate}
                          onChange={handleTaskBlur}
                            format="YYYY-MM-DD"
                            minDate={dayjs()} // Restricts selection to today and future dates
                        />
                        </LocalizationProvider>

                        <p style={{ margin: '5px 0 0 0' }}>Choose an assignees</p> 

                        <Members>
                        {icons.length !== 0 ? (
                        <AvatarGroup>
                            {icons.map((icon, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                sx={{ marginRight: "-15px", width: "38px", height: "38px" }}
                                >
                                {icon?.charAt(0).toUpperCase()}
                                </Avatar>
                            </div>
                            ))}
                        </AvatarGroup>
                        ) : (
                        <Avatar
                            sx={{
                            backgroundColor: 'transparent',
                            border: '1px dashed #000',
                            color: '#000'
                            }}
                        >
                            <AccountCircleIcon />
                        </Avatar>
                        )}

                            <InviteButton onClick={() => setInvitePopup(true)}>
                                <PersonAdd sx={{ fontSize: "12px" }} />
                                Invite
                            </InviteButton>
                        </Members>

                        {invitePopup && (
                        <InviteRuleTaskMembers
                            setInvitePopup={setInvitePopup}
                            selectCollaboratorIds={selectCollaboratorIds}
                            setSelectCollaboratorIds={setSelectCollaboratorIds}
                            selectTeamIds={selectTeamIds}
                            setSelectTeamIds={setSelectTeamIds}
                            icons={icons}
                            setIcons={setIcons}
                        />
                        )}

                    <p style={{ margin: '5px 0 0 0' }}>Set Tags</p> 
                    <OutlinedBox style={{ marginTop: "6px", width: '-webkit-fill-available' }}>
                        <Desc
                        placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                        name="tags"
                        rows={4}
                        value={option6.tags}
                        onChange={handleCreateTask}
                        />
                    </OutlinedBox>

                    <OutlinedBox
                        button={true}
                        style={{ marginTop: "18px", width: "-webkit-fill-available", color: '#fff', backgroundColor: option6.name != "" && option6.description != "" && option6.dueDate != "" && option6.priority != "" && option6.tags.length != 0 ? '#03a6b1' : '#000' }}
                        onClick={() => {
                        option6.name != "" && option6.description != "" && option6.dueDate != "" && option6.priority != "" && option6.tags.length != 0 && createTaskCard();
                        }}
                    >
                        Create Task
                    </OutlinedBox>
                        
                  </Box>
        
              </Box>
            </DrawerContainer>
          );


  return (
   
    <Container className={"item"}>
      <Top>
        <Title>Actions</Title>
      </Top>


      <Bottom>
            <p>Move task</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }}
            onClick={() => {
                eventHandle("Task moved")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <MoveUpIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Move to a section...</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Remove task")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <DeleteForeverIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Remove task from the project</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Change status</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Change status")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <CheckCircleOutlineIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Change the completion status to...</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Change task field to...</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => eventHandle("Change assignee") } >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <GroupAddIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Change assignee to...</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Change due date")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <InsertInvitationIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Change due date to...</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Set task title")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <TitleIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Set task title to</TaskMainText>
                    </div>
                </div>
            </Button>

            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Set task description")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <DescriptionIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Set task description to</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Create new</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Create task")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <AddTaskIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Create a task...</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Create approvel")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <AssignmentTurnedInIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Create approvels...</TaskMainText>
                    </div>
                </div>
            </Button>

      </Bottom>


        <Drawer 
            anchor="right" 
            open={open3} 
            onClose={toggleActionDrawer(false, 3)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionList}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open1} 
            onClose={toggleActionDrawer(false, 1)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerWorkList}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open2} 
            onClose={toggleActionDrawer(false, 2)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionStatusChange}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open4} 
            onClose={toggleActionDrawer(false, 4)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionTitleChange}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open5} 
            onClose={toggleActionDrawer(false, 5)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionDescriptionChange}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open6} 
            onClose={toggleActionDrawer(false, 6)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionDueDateChange}
        </Drawer>

        <Drawer 
            anchor="right" 
            open={open7} 
            onClose={toggleActionDrawer(false, 7)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionTaskCreate}
        </Drawer>
    

    </Container>

  );
};

export default ActionFunctionCards;
