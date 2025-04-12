import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import axios from "axios";
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
import DiscountIcon from '@mui/icons-material/Discount';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import FeedIcon from '@mui/icons-material/Feed';
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {PersonAdd} from "@mui/icons-material";
import InviteMembers from "./InviteMembers";
import InviteActionMembers from "./InviteActionMember";


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
  font-size: 15px;
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


const ActionFunctionCards = ({ activeAction, setActiveAction, projectId, setIsActiveAction, setIsActiveTrigger, existingRule }) => {

    const [open, setOpen] = useState(false);
      const [invitePopup, setInvitePopup] = useState(false);
        const [icons, setIcons] = useState([]);
          const [collaboratorUpdated, setCollaboratorUpdated] = useState(false);
          const [isSetAssignee, setIsSetAssignee] = useState(true);
          const [isActive, setIsActive] = useState(false);

    const toggleActionDrawer = (newOpen) => () => {
        setOpen(newOpen);
      };

      console.log(existingRule);
      

  const eventHandle = (event) => {
    setIsActiveAction(true);
    setIsActiveTrigger(false);

    if(event === "Task moved") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Task moved" } });
    }
    if(event === "Remove task") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Remove task from the project" } });
    }
    if(event === "Change assignee") {
        setActiveAction({ ...activeAction, actionDetails: { actionType: "Set assignee to" } });
        setOpen(true);
    }
    if(event === "Change status") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Change status" } });
    }
    if(event === "Change due date") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Change due date" } });
    }
    if(event === "Set task title") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Set task title" } });
    }
    if(event === "Set task description") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Set task description" } });
    }
    if(event === "Create task") {
      setActiveAction({ ...activeAction, actionDetails: { actionType: "Create task" } });
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

  const DrawerActionList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleActionDrawer(false)}>
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
              <InviteActionMembers
                setInvitePopup={setInvitePopup}
                id={projectId}
                icons={icons}
                setIcons={setIcons}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
              />
            )}

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
            open={open} 
            onClose={toggleActionDrawer(false)} 
            TransitionComponent={Slide}
            transitionDuration={1000}
        >
            {DrawerActionList}
        </Drawer>

        

    </Container>

  );
};

export default ActionFunctionCards;
