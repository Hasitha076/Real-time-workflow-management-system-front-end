import React, { use, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import form from "../Images/google-forms.png";
import taskIcon from "../Images/tasks.png";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UpdateTaskTemplate from "./UpdateTaskTemplate";

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
  font-size: 17px;
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

const WorkFlowMainCard = ({ status, work, newForm, setNewForm, setNewTaskTemplate, projectId, taskTemplateAdded, setTaskTemplateAdded }) => {
  
  const [task, setTask] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [updateTaskTemplate, setUpdateTaskTemplate] = useState(false);
  const [templateDetails, setTemplateDetails] = useState({});
  const [taskTemplateUpdated, setTaskTemplateUpdated] = useState(false);

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
  }, []);

  const getTaskTemplates = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getTaskTemplatesByProjectId/${projectId}`)
      .then((res) => {
        setTaskTemplates(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

useEffect(() => {
  getTaskTemplates();
}, [projectId]);

if (taskTemplateAdded) {
  getTaskTemplates();
  setTaskTemplateAdded(false);
}
if(taskTemplateUpdated) {
  getTaskTemplates();
  setTaskTemplateUpdated(false);
}


  return (
   
    <Container className={"item"}>
      <Top>
        <Title>How will tasks to be added to the project?</Title>
      </Top>


      <Bottom>
        <Button style={{ border: '1px dashed #fff', padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} onClick={() => setNewForm(true)} >
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "8px" }}>
                <Image src={form} />
                <div>
                    <TaskMainText>Form Submission</TaskMainText>
                    <TaskText>Create a form that turns submission into tasks.</TaskText>
                </div>
            </div>
        </Button>
        <br />
        <Button style={{ border: '1px dashed #fff', padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} onClick={() => setNewTaskTemplate(true)} >
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "8px" }}>
            <Image src={taskIcon} />
                <div>
                    <TaskMainText>Task Templates</TaskMainText>
                    <TaskText>Create a template to easily standarize tasks.</TaskText>
                </div>
            </div>
        </Button>

        {taskTemplates?.map((template) => (
                      
                      <Button style={{ border: '1px solid #fff', backgroundColor: "#ffffff", padding: '10px 20px', borderRadius: '10px', width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-start' }} onClick={() => {setUpdateTaskTemplate(true); setTemplateDetails(template)}} >
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "8px" }}>
            <Image src={taskIcon} />
                <div>
                    <TaskMainText>{template.taskTemplateName}</TaskMainText>
                </div>
            </div>
        </Button>
                    ))}


      </Bottom>

      {updateTaskTemplate && <UpdateTaskTemplate setTaskTemplateUpdated={setTaskTemplateUpdated} setUpdateTaskTemplate={setUpdateTaskTemplate} taskTemplate={taskTemplates} templateDetails={templateDetails} setTemplateDetails={setTemplateDetails} />}

    </Container>

  );
};

export default WorkFlowMainCard;
