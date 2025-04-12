import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const RuleTemplateCard = ({ status, work, setInviteMemberPopup, setInviteTeamPopup, setWorkDetails }) => {
  
  const [color, setColor] = useState("primary");
  const [task, setTask] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [progress, setProgress] = useState(0);

  const getTasks = async (work) => {
    await axios.get(`http://localhost:8082/api/v1/task/getTasksByProjectId/${work.projectId}`)
    .then((res) => {
      console.log(res.data);
      
      const filterData = res.data.filter((item) => item.workId === work.workId);
      setTask(filterData);
    })
    .catch((err) => {
      console.log(err);
    });
  }


  useEffect(() => {
    getTasks(work);
  }, [work]);

  console.log(work);
  console.log(task);
  

  useEffect(() => {
    let count = 0;
    let Members = [];
    task.forEach((item) => {
      if (item.status === true) {
        count++;
      }
    
    });
    setCompleted(count);
    setProgress(completed);
  }, [task]);

    const navigate = useNavigate();
  return (
   
    <Container className={"item"} onClick={() => navigate(`/rule/${work.projectId}`)}>
      <Top>
        <Title>{work.workName}</Title>
      </Top>

      <Bottom>
        <p>Rules</p>
      </Bottom>
      
    </Container>

  );
};

export default RuleTemplateCard;
