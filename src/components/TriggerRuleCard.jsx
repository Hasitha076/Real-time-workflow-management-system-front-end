import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button } from "@mui/material";
import axios from "axios";
import Avatar from "@mui/material/Avatar";

const Container = styled.div`
  padding: 14px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  width: 500px;
  /* background-color: ${({ theme }) => theme.card}; */
  color: ${({ theme }) => theme.text};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  padding: 20px;
  flex: 7;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Progress = styled.div`
  position: relative;
`;

const Text = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin: 14px 0px 10px 0px;
  line-height: 1.5;
  overflow: hidden;
`;

const TaskText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  text-transform: capitalize;
  color: ${({ theme }) => theme.soft2};
  line-height: 1.5;
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
  gap: 5px;
  margin: 20px 0px 14px 0px;
  text-align: left;
`;

const TriggerRuleCard = ({  trigger }) => {
  

  console.log(trigger);

  
  return (
   
    <Container className={"item"}>
      <Top>
        {trigger.triggerDetails.triggerType == undefined ? 
        <Title>+ Add {trigger.type} - {trigger.id} - {trigger.status}</Title> 
        :

        <Title style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>
            {trigger.triggerDetails.triggerType} <span> - </span>
                {trigger.triggerDetails.triggerType === "Section changed" ?
                trigger.triggerDetails.section
                 :
                trigger.triggerDetails.triggerType === "Section is" ?
                trigger.triggerDetails.section.workName
                 : trigger.triggerDetails.triggerType === "Task is add from" ? 
                trigger.triggerDetails.task 
                : 
                trigger.triggerDetails.triggerType === "Set assignee to" ? 
                trigger.triggerDetails.assignee 
                : 
                trigger.triggerDetails.triggerType === "Assignee is..." ?
                <div style={{display: "flex", alignItems: "center"}}>
                  <Avatar
                  sx={{ marginRight: "5px", width: "38px", height: "38px" }}>
                  {trigger.triggerDetails.assignee?.name.charAt(0).toUpperCase()}
                  </Avatar>  
                  {trigger.triggerDetails.assignee?.name}
                </div>
                : null
                }
        </Title> 
        }
      </Top>
      
    </Container>

  );
};

export default TriggerRuleCard;