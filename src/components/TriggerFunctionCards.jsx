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

const TriggerFunctionCards = ({ status, work, activeTrigger, setActiveTrigger, projectId, setIsActiveTrigger, setIsActiveAction, existingRule }) => {
  

  console.log(existingRule);

  const eventHandle = (event) => {
    setIsActiveTrigger(true);
    setIsActiveAction(false);

    if(event === "Task moved") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task moved" } });
    }
    if(event === "Task added") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task added" } });
    }
    if(event === "Task assigned") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task assigned" } });
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
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Task status changed" } });
    }
    if(event === "Approval status changed") {
      setActiveTrigger({ ...activeTrigger, triggerDetails: { triggerType: "Approval status changed" } });
    }

  }


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
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
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
            <Button disabled={existingRule} style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} 
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

    </Container>

  );
};

export default TriggerFunctionCards;
