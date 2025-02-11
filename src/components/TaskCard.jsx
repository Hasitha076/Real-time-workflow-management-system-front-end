import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import axios from "axios";
import { format } from "timeago.js";
import { tagColors } from "../data/data";

import {
  TimelapseRounded,
  StarsRounded,
  PrivacyTipRounded
} from "@mui/icons-material";
import Checkbox from '@mui/material/Checkbox';
import InputIcon from '@mui/icons-material/Input';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { IconButton } from "@mui/material";
import CommentCard from "./CommentCard";

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
  font-size: 16px;
  font-weight: 500;
  padding-left: 10px;
  color: ${({ theme }) => theme.textSoft};
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 10px;
  font-weight: 500;
`;

const Span = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.soft2};
  line-height: 1.5;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px 14px 0px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2 + "99"};
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;
const IcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const DrawerContainer = styled.div`
  padding: 35px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
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


const OutlinedBox = styled.div`
  min-height: 100px;
  width: 100%;
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
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 15px;
`;


const Description = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const CommentButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primary + "cc"};
  }
`

const TaskCard = ({item, index, members, teams, setTaskAdd, work, tasks}) => {

  const [completed, setCompleted] = useState(false);
  const [taskCollaborators, setTaskCollaborators] = useState([]);
  const [taskTeams, setTaskTeams] = useState([]);
  const [allTaskMembers, setAllTaskMembers] = useState([]);
  const [comment, setComment] = useState([]);
  const commentData = [];

  console.log("works: ", work);
  console.log("tasks: ", tasks);
  
  
  
        useEffect(() => {
    
          if (item?.collaboratorIds || members.length > 0) {
            const matchingUsers = members?.filter((user) =>
              item.collaboratorIds.includes(user.userId)
            ).map((user) => ({
              id: user.userId,
              name: user.userName,
              email: user.email,
            }));
        
            setTaskCollaborators(matchingUsers);
          }
    
        
          if (item?.teamIds || teams.length > 0) {
            const matchingTeams = teams?.filter((team) =>
              item.teamIds.includes(team.teamId)
            ).map((team) => ({
              id: team.teamId,
              name: team.teamName
            }));
        
            setTaskTeams(matchingTeams);
          }

          if(taskCollaborators || taskTeams) {
            setAllTaskMembers([...taskCollaborators, ...taskTeams]);
          }
  
  
        }, [item, members, teams, item]);
  
        console.log("TaskCard taskCollaborators: ", taskCollaborators);
        console.log("TaskCard taskTeams: ", taskTeams);
        console.log("TaskCard allTaskMembers: ", allTaskMembers);
        
        
        const changeStateFunction = async (status) => {
          console.log("clicked ===> ", item.taskId);

          setTimeout(() => {
            setCompleted(status);
            setTaskAdd(true)

            if (tasks.some((task) => task.workId !== work.workId)) {
              axios.put(`http://localhost:8086/api/v1/work/updateWork`, {
                  workId: work.workId, 
                  workName: work.workName, 
                  description: work.description, 
                  priority: work.priority,
                  projectId: work.projectId,
                  dueDate: work.dueDate,
                  collaboratorIds: work.collaboratorIds,
                  teamIds: work.teamIds,
                  memberIcons: work.memberIcons,
                  status: true,
                  tags: work.tags
              });
          }
          

          }, 1000)
          console.log(item.comments.length);
          

          // if(item.comments.length === 0) {
          //   await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
          //     taskId: item.taskId,
          //     taskName: item.taskName,
          //     description: item.description,
          //     assigneeId: item.assigneeId,
          //     priority: item.priority,
          //     dueDate: item.dueDate,
          //     projectId: item.projectId,
          //     collaboratorIds: item.collaboratorIds,
          //     teamIds: item.teamIds,
          //     memberIcons: item.memberIcons,
          //     tags: item.tags,
          //     workId: item.workId,
          //     comments: null,
          //     status: status
          //   })
          //   .then((res) => {
          //     console.log(res.data);
          //   })
          // } else {
          //   await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
          //     taskId: item.taskId,
          //     taskName: item.taskName,
          //     description: item.description,
          //     assigneeId: item.assigneeId,
          //     priority: item.priority,
          //     dueDate: item.dueDate,
          //     projectId: item.projectId,
          //     collaboratorIds: item.collaboratorIds,
          //     teamIds: item.teamIds,
          //     memberIcons: item.memberIcons,
          //     tags: item.tags,
          //     workId: item.workId,
          //     comments: item.comments,
          //     status: status
          //   })
          //   .then((res) => {
          //     console.log(res.data);
          //   })
          // }

          if(status === true) {
            if(item.comments.length === 0) {
              await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
                taskId: item.taskId,
                taskName: item.taskName,
                description: item.description,
                assigneeId: item.assigneeId,
                priority: item.priority,
                dueDate: item.dueDate,
                projectId: item.projectId,
                collaboratorIds: item.collaboratorIds,
                teamIds: item.teamIds,
                memberIcons: item.memberIcons,
                tags: item.tags,
                workId: item.workId + 1,
                comments: null,
                status: !status
              })
              .then((res) => {
                console.log(res.data);
              })
            } else {
              await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
                taskId: item.taskId,
                taskName: item.taskName,
                description: item.description,
                assigneeId: item.assigneeId,
                priority: item.priority,
                dueDate: item.dueDate,
                projectId: item.projectId,
                collaboratorIds: item.collaboratorIds,
                teamIds: item.teamIds,
                memberIcons: item.memberIcons,
                tags: item.tags,
                workId: item.workId + 1,
                comments: item.comments,
                status: !status
              })
              .then((res) => {
                console.log(res.data);
              })
            }
          } else {
            if(item.comments.length === 0) {
              await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
                taskId: item.taskId,
                taskName: item.taskName,
                description: item.description,
                assigneeId: item.assigneeId,
                priority: item.priority,
                dueDate: item.dueDate,
                projectId: item.projectId,
                collaboratorIds: item.collaboratorIds,
                teamIds: item.teamIds,
                memberIcons: item.memberIcons,
                tags: item.tags,
                workId: item.workId - 1,
                comments: null,
                status: !status
              })
              .then((res) => {
                console.log(res.data);
              })
            } else {
              await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
                taskId: item.taskId,
                taskName: item.taskName,
                description: item.description,
                assigneeId: item.assigneeId,
                priority: item.priority,
                dueDate: item.dueDate,
                projectId: item.projectId,
                collaboratorIds: item.collaboratorIds,
                teamIds: item.teamIds,
                memberIcons: item.memberIcons,
                tags: item.tags,
                workId: item.workId - 1,
                comments: item.comments,
                status: !status
              })
              .then((res) => {
                console.log(res.data);
              })
            }
          }
        
        }

  useEffect(() => {

    console.log("Completed status updated:", completed);
    
  }, [completed, item, comment]);


  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // comment
  const handleComment = async () => {
    console.log("Commented ===> ", item.taskId);
    console.log("Commented ===> ", comment);
    console.log(item);

    commentData.push(comment);


    await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
      taskId: item.taskId,
      taskName: item.taskName,
      description: item.description,
      assigneeId: item.assigneeId,
      priority: item.priority,
      dueDate: item.dueDate,
      projectId: item.projectId,
      collaboratorIds: item.collaboratorIds,
      teamIds: item.teamIds,
      memberIcons: item.memberIcons,
      tags: item.tags,
      workId: item.workId,
      status: completed,
      comments: commentData
    })
    .then((res) => {
      console.log(res.data);
      setComment("");
    })
  
  }

  const DrawerList = (
    <DrawerContainer>
      <IcoBtn onClick={toggleDrawer(false)}>
        <KeyboardDoubleArrowRightIcon/>
      </IcoBtn>
      <Box sx={{ width: 500 }} role="presentation">
          <top>
            <h1 style={{ margin: '10px 0' }}>{item.taskName}</h1>
          </top>
          <Desc>{item.description}</Desc>
          <Tags>
              {item.tags.map((tag, index) => (
                <Tag
                key={index}
                  tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
                >
                  {tag}
                </Tag>
              ))}
            </Tags>
          <Divider sx={{ padding: '10px 0' }} />

          <Box sx={{ display: 'flex', paddingTop: '20px' }}>
          <h3 style={{ margin: '0' }}>Assignee: </h3> 
          <AvatarGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', paddingLeft: '20px' }}>
                {allTaskMembers.map((member) => (
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 <Button sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0' }}>
                  <Avatar
                    sx={{
                      marginRight: "5px",
                      width: "26px",
                      height: "26px",
                      fontSize: "16px",
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <h6 style={{ margin: '0' }}>{member.name}</h6>
                
                 </Button>
                  <IcoBtn sx={{ padding: '5px', marginLeft: '5px' }} >
                    <CloseIcon sx={{ fontSize: '18px' }} />
                </IcoBtn>
                </Box>
                  
                ))}
                
              </AvatarGroup>
          </Box>

          
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px'}}>
          <h3 style={{ margin: '0' }}>Due Date: </h3> 
          <Box style={{ marginTop: "0px" }}>
            
            <TextInput
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              id="dueDate"
              name="dueDate"
              style={{ fontSize: "16px", color: '#000' }}
              placeholder="Due Date"
              value={item.dueDate}
              // onChange={handleChange}
            />
            </Box>
          </Box>

          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px'}}>
          <h3 style={{ margin: '0' }}>Project: </h3> 
          <p style={{ margin: '0', padding: '0 5px' }}>{item.projectId}</p>
                

          </Box>

          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px'}}>
            <h3 style={{ margin: '0' }}>Description: </h3> 
                <p style={{ margin: '0', padding: '0 5px' }}>{item.description}</p>
          </Box>
          <Divider sx={{ padding: '10px 0' }} />

          <Box>
            <h3>Comments:</h3>

           <CommentCard item={item} allTaskMembers={allTaskMembers}  />
            
            <Box sx={{ display: 'flex', paddingTop: '20px' }}>
              {allTaskMembers.slice(0, 1).map((member) => (

                <Avatar
                  sx={{
                    marginRight: "5px",
                    width: "26px",
                    height: "26px",
                    fontSize: "16px",
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>

                ))}
                
              <Box style={{
                  width: "100%",
                  display:" flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "flex-end"
   
              }}>
                <OutlinedBox style={{ marginTop: "6px", width: '-webkit-fill-available' }}>
                  <Description
                      placeholder="Add a comment"
                      name="description"
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                  />
                    
                </OutlinedBox>
                <CommentButton onClick={() => handleComment()}>Submit</CommentButton>
              </Box>
            </Box>
          
          </Box>
        
      </Box>
    </DrawerContainer>
  );
    

  return (
    <>
    {item && (
            <Container className={"item"}>
            <Top>
            {item.status === true ? (
              <Checkbox checked={!completed} style={{ borderRadius: '100px', padding: '0', color: completed ? 'orange' : 'green'  }} onClick={() => changeStateFunction(completed)} /> 
            ) : (
              <Checkbox checked={completed} style={{ borderRadius: '100px', padding: '0', color: completed ? 'green' : 'orange'  }} onClick={() => changeStateFunction(!completed)} /> 
            )}

            <Title>{item.taskName}</Title>
              {item.priority === "HIGH" &&
                <>
                <PrivacyTipRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'red' }} />
                <h6 style={{ paddingLeft: "5px", margin: "0" }} >URGENT</h6>
                </>
              }
             
              {item.priority === "MEDIUM" &&
                <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'orange' }} />
              }
      
              {item.priority === "LOW" &&
                <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'green' }} />
              }
              
              <IcoBtn>
                <InputIcon style={{ flex: "1", fontSize: '20px' }} onClick={toggleDrawer(true)} />
              </IcoBtn>

            </Top>
            <Desc>{item.description}</Desc>
            <Tags>
              {item.tags.map((tag) => (
                <Tag
                  tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
                >
                  {tag}
                </Tag>
              ))}
            </Tags>
            
            <Bottom>
              <Time>
                <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
                {format(item.updatedAt)}
              </Time>
              <AvatarGroup>
                {allTaskMembers.slice(0, 2).map((member) => (
                  <Avatar
                    sx={{
                      marginRight: "-13px",
                      width: "26px",
                      height: "26px",
                      fontSize: "16px",
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
                {allTaskMembers.length > 2 && (
                  <Avatar
                    sx={{
                      marginRight: "-13px",
                      width: "26px",
                      height: "26px",
                      fontSize: "12px",
                    }}
                  >
                    +{allTaskMembers.length - 2}
                  </Avatar>
                )}
              </AvatarGroup>
            </Bottom>

            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} >
              {DrawerList}
            </Drawer>
          </Container>
    )}
    </>
  );
};



export default TaskCard;
