import React, { use, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import form from "../Images/google-forms.png";
import taskIcon from "../Images/tasks.png";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UpdateTaskTemplate from "./UpdateTaskTemplate";
import DeletePopup from "./DeletePopup";
import MoveUpIcon from '@mui/icons-material/MoveUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {Drawer, Slide} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {PersonAdd} from "@mui/icons-material";
import InviteActionMembers from "./InviteActionMember";
import InviteTriggerMembers from "./InvitetriggerMembers";


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

const TaskText = styled.text`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  text-transform: capitalize;
  color: ${({ theme }) => theme.soft2};
  line-height: 1.2;
  overflow: hidden;
`;

const Span = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.soft2};
  line-height: 1.5;
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

const Image = styled.img`
  height: 30px;
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

const IcoBtn = styled(IconButton)`
  width: 15px;
  height: 15px;
  color: ${({ theme }) => theme.white} !important;
  &:hover {
    background-color: ${({ theme }) => theme.white} !important;
    color: ${({ theme }) => theme.black} !important;
  }
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


const TriggerFunctionCards = ({ status, works, taskTemplates, activeTrigger, setActiveTrigger, projectId, setIsActiveTrigger, setIsActiveAction, existingRule }) => {
  
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [whichSection, setWhichSection] = useState(false);
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [option5, setOption5] = useState("");
    const [icons, setIcons] = useState([]);
    const [isSetAssignee, setIsSetAssignee] = useState(false);
     const [invitePopup, setInvitePopup] = useState(false);
       const [assignee, setAssignee] = useState("");

    console.log(option1);
    console.log(option2);
    console.log(activeTrigger);
    console.log(taskTemplates);
    
    
    
        const handleChange = (event) => {
            setOption1(event.target.value);
            if (event.target.value === "Section_changed") {
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Section changed", section: "Any section" } });
                setWhichSection(false);
            } else if (event.target.value === "Section_is") {
                setWhichSection(true);
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Section is", section: option2 } });
                setIcons([]);
            }
            
        }

        const handleWorkChange = (event) => {
            const { workId, workName } = JSON.parse(event.target.value);
            setOption2({ workId, workName });
            setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Section is", section: { workId, workName } } });
            setIcons([]);
            
        }

        const handleTaskAddChange = (event) => {
            setOption3(event.target.value);
            setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task is add from", task: event.target.value } });
            setIcons([]);
            
        }

        const handleAssigneeChange = (event) => {
            setAssignee(event.target.value);
            if (event.target.value === "Assignee is changed") {
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Assignee is changed" } });
                setIsSetAssignee(false);
            } else if (event.target.value === "Assignee is empty") {
                setIsSetAssignee(false);
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Assignee is empty" } });
                setIcons([]);
            } else if (event.target.value === "Assignee is...") {
                setIsSetAssignee(true);
                setIcons([]);
            }
            
        }

        const handleStatusChange = (event) => {
            setOption5(event.target.value);
            if (event.target.value === "Status_is_changed") {
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Status is changed" } });
                setWhichSection(false);
            } else if (event.target.value === "Status_is_incomplete") {
                setWhichSection(true);
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Section is incomplete"} });
                setIcons([]);
            } else if (event.target.value === "Status_is_complete") {
                setWhichSection(true);
                setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Section is complete"} });
                setIcons([]);
            }
            
        }

    const toggleTriggerDrawer = (newOpen, number) => () => {
        if(number === 1) {
            setOpen1(newOpen);
        } else if(number === 2) {
            setOpen2(newOpen);
        } else if (number === 3) {
            setOpen3(newOpen)
        } else if (number === 4) {
            setOpen4(newOpen)
        }
      };

  console.log(existingRule);

  const eventHandle = (event) => {
    setIsActiveTrigger(true);
    setIsActiveAction(false);

    if(event === "Task moved") {
        setOpen1(true);
    }
    if(event === "Task added") {
        setOpen2(true);
    }
    if(event === "Task assigned") {
      setOpen3(true);
    }
    if(event === "Due date changed") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Due date changed" } });
    }
    if(event === "Due date approaching") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Due date approaching" } });
    }
    if(event === "Task overdue") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task overdue" } });
    }
    if(event === "Task status changed") {
      setOpen4(true);
    }
    if(event === "Approval status changed") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Approval status changed" } });
    }

  }


  const DrawerTriggerList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleTriggerDrawer(false, 1)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '400px' }} role="presentation">
          <top>
            <h2 style={{ margin: '10px 0' }}>Task is moved to a section</h2>
          </top>

          <Divider sx={{ padding: '10px 0' }} />

          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <p style={{ margin: '0' }}>Choose an option</p> 

            <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                <select
                id="priority"
                name="priority"
                value={option1}
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
                    Section is changed
                </option>
                <option value="Section_changed">Section is changed</option>
                <option value="Section_is">Section is...</option>
                </select>
            </OutlinedBox>
          </Box>

          {whichSection && (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <p style={{ margin: '0' }}>Choose a work</p> 

            <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                <select
                id="work"
                name="work"
                value={option2}
                onChange={(e) => handleWorkChange(e)}
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
          )}

      </Box>
    </DrawerContainer>
  );


  const DrawerTriggerAddTaskList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleTriggerDrawer(false, 2)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '400px' }} role="presentation">
          <top>
            <h2 style={{ margin: '10px 0' }}>Task is added to this project</h2>
          </top>

          <Divider sx={{ padding: '10px 0' }} />


            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <p style={{ margin: '0' }}>Choose a source</p> 

            <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                <select
                id="work"
                name="work"
                value={option3}
                onChange={(e) => handleTaskAddChange(e)}
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
                <option value="All tasks">
                    All tasks
                </option>
                {taskTemplates.map((taskTemplate) => (
                    <option key={taskTemplate.taskTemplateId} value={taskTemplate.taskTemplateName}>
                    {taskTemplate.taskTemplateName}
                    </option>
                ))}
                </select>

            </OutlinedBox>
          </Box>

      </Box>
    </DrawerContainer>
  );

  const DrawerTriggerAssigneesList = (
      <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
        <ArrowIcoBtn onClick={toggleTriggerDrawer(false, 3)}>
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
                      onChange={handleAssigneeChange}
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
                        Assignee is changed
                      </option>
                      <option value="Assignee is changed">Assignee is changed</option>
                      <option value="Assignee is empty">Assignee is empty</option>
                      <option value="Assignee is...">Assignee is...</option>
                    </select>
                  </OutlinedBox>
  
                  <br />
                  {isSetAssignee && 
                  <>
                      <p style={{ margin: '0' }}>Choose an assignee</p> 
  
                      <Members>
                          {icons.length != 0 ? <AvatarGroup>
            
                              <Avatar
                                  sx={{ marginRight: "5px", width: "38px", height: "38px" }}
                              >
                                  {icons[0].name.charAt(0).toUpperCase()}
                              </Avatar>
                              {icons[0].name}
                              
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
                <InviteTriggerMembers
                  setInvitePopup={setInvitePopup}
                  id={projectId}
                  icons={icons}
                  setIcons={setIcons}
                  activeTrigger={activeTrigger}
                  setActiveTrigger={setActiveTrigger}
                />
              )}
  
            </Box>
  
        </Box>
      </DrawerContainer>
    );


    const DrawerTriggerStatusChange = (
        <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
          <ArrowIcoBtn onClick={toggleTriggerDrawer(false, 4)}>
            <KeyboardDoubleArrowRightIcon/>
          </ArrowIcoBtn>
          <Box sx={{ width: '400px' }} role="presentation">
              <top>
                <h2 style={{ margin: '10px 0' }}>Task completion status is changed</h2>
              </top>
    
              <Divider sx={{ padding: '10px 0' }} />
    
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
                <p style={{ margin: '0' }}>Choose an option</p> 
    
                <OutlinedBox style={{ marginTop: "0px", width: '-webkit-fill-available' }}>
                    <select
                    id="priority"
                    name="priority"
                    value={setOption5}
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
                        Status is changed
                    </option>
                    <option value="Status_is_changed">Status is changed</option>
                    <option value="Status_is_incomplete">Status is incomplete</option>
                    <option value="Status_is_complete">Status is complete</option>
                    </select>
                </OutlinedBox>
              </Box>
    
          </Box>
        </DrawerContainer>
      );


  return (
   
    <Container className={"item"}>
      <Top>
        <Title>Triggers</Title>
      </Top>


      <Bottom>
            <p>Task moved</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }}
            onClick={() => {
                eventHandle("Task moved")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <MoveUpIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Task is moved to a section</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Task added")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <AddCircleIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Task is add to this project</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Task field is...</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Task assigned")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <GroupAddIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Task is assigned to...</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Due date is...</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Due date changed")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <CalendarMonthIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Due date is changed</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={true} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Due date approaching")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <InsertInvitationIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Due date is approaching</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={true} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Task overdue")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <HistoryIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Task is overdue</TaskMainText>
                    </div>
                </div>
            </Button>

            <br />

            <p>Task status is changed</p>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Task status changed")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <CheckCircleOutlineIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Task completion status is changed</TaskMainText>
                    </div>
                </div>
            </Button>
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
            onClick={() => {
                eventHandle("Approval status changed")
            }} >
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "10px" }}>
                <VerifiedIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
                    <div>
                        <TaskMainText>Approvel status is changed</TaskMainText>
                    </div>
                </div>
            </Button>

      </Bottom>

      <Drawer 
        anchor="right" 
        open={open1} 
        onClose={toggleTriggerDrawer(false, 1)} 
        TransitionComponent={Slide}
        transitionDuration={1000}
        >
            {DrawerTriggerList}
        </Drawer>

        <Drawer 
        anchor="right" 
        open={open2} 
        onClose={toggleTriggerDrawer(false, 2)} 
        TransitionComponent={Slide}
        transitionDuration={1000}
        >
            {DrawerTriggerAddTaskList}
        </Drawer>

        <Drawer 
        anchor="right" 
        open={open3} 
        onClose={toggleTriggerDrawer(false, 3)} 
        TransitionComponent={Slide}
        transitionDuration={1000}
        >
            {DrawerTriggerAssigneesList}
        </Drawer>

        <Drawer 
        anchor="right" 
        open={open4} 
        onClose={toggleTriggerDrawer(false, 4)} 
        TransitionComponent={Slide}
        transitionDuration={1000}
        >
            {DrawerTriggerStatusChange}
        </Drawer>

    </Container>

  );
};

export default TriggerFunctionCards;
