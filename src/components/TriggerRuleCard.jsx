import React from "react";
import styled from "styled-components";
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
  font-size: 15px;
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

const TriggerRuleCard = ({  trigger }) => {
  
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
                 : 
                trigger.triggerDetails.triggerType === "All tasks" ? 
                trigger.triggerDetails.section === "Any Work" ? "Any Work" : trigger.triggerDetails.section.workName
                : 
                trigger.triggerDetails.triggerType === "Task is added from" ? 
                trigger.triggerDetails.taskTemplate.taskTemplateName + " - " + (trigger.triggerDetails.section === "Any Work" ? "Any Work" : trigger.triggerDetails.section.workName)
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