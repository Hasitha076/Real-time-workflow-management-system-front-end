import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoveUpIcon from '@mui/icons-material/MoveUp';

const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
  &:hover {
    transition: all 0.6s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
    background-color: ${({ theme }) => theme.soft2};
    color: ${({ theme }) => theme.black};
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-top: 6px;
  flex: 7;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
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

const RuleTemplateCard = ({ rule, existingRule }) => {

  const navigate = useNavigate();
  
  return (
   
    <Container style={{ backgroundColor: rule.status === 'active' && '#a4b3c4' }} className={"item"} onClick={() => navigate(`/rule/${rule.projectId}`, { state: { existingRule, ruleDetails: rule } })}>
      <Top>
      <AddCircleIcon style={{ backgroundColor: "#0059fe9e", padding: "5px", borderRadius: "5px" }} />
      +
      <MoveUpIcon style={{ backgroundColor: "#e2e0e09e", padding: "5px", borderRadius: "5px" }} />
      </Top>

      <Bottom>
      <Title>{rule.triggers[0].triggerDetails.triggerType} - {rule.actions[0].actionDetails.actionType}</Title>
      </Bottom>
      
    </Container>

  );
};

export default RuleTemplateCard;
