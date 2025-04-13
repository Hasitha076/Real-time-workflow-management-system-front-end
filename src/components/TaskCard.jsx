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
import {Drawer, Slide } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { IconButton } from "@mui/material";
import CommentCard from "./CommentCard";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_PROJECT_BY_ID, UPDATE_PROJECT_STATUS } from "../GraphQL/Queries";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UpdateWork from "./UpdateWork";
import UpdateTask from "./UpdateTask";
import CheckIcon from '@mui/icons-material/Check';

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

const TaskCard = ({item, index, members, teams, setTaskAdd, work, tasks, editTask, setEditTask, workCollaborators, workTeams, setUpdateWorkFromTask, allWorks}) => {

  const [completed, setCompleted] = useState(false);
  const [project, setProject] = useState([]);
  const [taskCollaborators, setTaskCollaborators] = useState([]);
  const [taskTeams, setTaskTeams] = useState([]);
  const [allTaskMembers, setAllTaskMembers] = useState([]);
  const [allWorkMembers, setAllWorkMembers] = useState([]);
  const [taskMembers, setTaskMembers] = useState([]);
  const [comment, setComment] = useState([]);
  const commentData = [];
  const [tasksData, setTasksData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs(item.dueDate));
  const [assigner, setAssigner] = useState([]);
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  console.log(editTask);
  
  
    const { loading, error, data, refetch } = useQuery(LOAD_PROJECT_BY_ID, {
      variables: { id: parseInt(item.projectId) },  // Ensure ID is an integer
      skip: !item.projectId,  // Avoid sending query if ID is undefined
      fetchPolicy: "cache-and-network" // Ensures fresh data is fetched
    });

        useEffect(() => {
          
          if (data?.getProject) {
            setProject((prev) => ({ ...prev, ...data.getProject }));
            };
        }, [loading, data]);

        console.log("Project: ", project);
        
        const getUser = async () => {
          await axios.get(`http://localhost:8081/api/v1/user/getUser/${item.assignerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":   "application/json",
                "Access-Control-Allow-Origin": "*",
              },
        })
          .then((res) => {
            console.log("Assigner: ", res.data);
            
            setAssigner(res.data);
          })
          .catch((err) => {
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          });
        }

        useEffect(() => {
          getUser();
        }, [])
  
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
        }, [item, members, teams]);

        useEffect(() => {
          setAllWorkMembers([
            ...workCollaborators.map((collaborator) => ({
              ...collaborator,
              type: "collaborator",
            })),
            ...workTeams.map((team) => ({
              ...team,
              type: "team",
            })),
          ]);
        }, [workCollaborators, workTeams]);

        useEffect(() => {
          setTaskMembers([
            ...taskCollaborators.map((collaborator) => ({
              ...collaborator,
              type: "collaborator",
            })),
            ...taskTeams.map((team) => ({
              ...team,
              type: "team",
            })),
          ]);
        }, [taskCollaborators, taskTeams]);
        
        
        // Separate useEffect to ensure `taskCollaborators` and `taskTeams` update before using them
        useEffect(() => {
          setAllTaskMembers((prev) => [...taskCollaborators, ...taskTeams]);
        }, [taskCollaborators, taskTeams]);
        

        const updateWorkStatus = async (value) => {
          try {
            const res = await axios.get(`http://localhost:8082/api/v1/task/getTasksByWorkId/${work.workId}`);
            
            console.log("res.data: ", res.data);
            
            if (res.data.length > 0) {
              setTasksData(res.data);
            }
        
            if (res.data.length === 0 || res.data.every((task) => task.status === true)) {
              await axios.put(`http://localhost:8086/api/v1/work/updateWorkStatus`, {
                workId: work.workId,
                status: true
              });
        
              const id = work.workId;
              const arrayIndex = allWorks.findIndex((item) => item.workId === id);
              
              if (arrayIndex !== -1 && arrayIndex + 1 < allWorks.length && value === "complete") {
                await axios.put(`http://localhost:8086/api/v1/work/updateWorkStatus`, {
                  workId: parseInt(allWorks[arrayIndex + 1].workId),
                  status: false
                }).then((res) => {
                  console.log("Updated work status: ", res.data);
                })
              } else {
                console.warn("No next work item found in allWorks.");
              }
        
              setUpdateWorkFromTask(true);
              await projectStatusUpdate();
            }
          } catch (err) {
            console.error("Error updating work status:", err);
          }
        };
        
        console.log("TaskCard tasksData: ", tasksData);
        console.log("item: ", item);
        console.log("Members: ", members);
        console.log("Teams: ", teams);
        console.log("Task collaborators: ", taskCollaborators);
        console.log("Task teams: ", taskTeams);
        console.log("All Task Members: ", allTaskMembers);
        console.log("Work collaborators: ", workCollaborators);
        console.log("Work teams: ", workTeams);
        console.log("All Work Members: ", allWorkMembers);
        console.log("Works: ", allWorks);
        
        
        
        

        const projectStatusUpdate = async () => {
          await axios.get(`http://localhost:8086/api/v1/work/getWorksByProjectId/${work.projectId}`)
          .then((res) => {
            console.log("res.data: ", res.data);
            if (!res.data?.every((work) => work.status == false)) {         
               updateProjectStatus({
                variables: {
                  projectId: parseInt(work.projectId),
                  input: {
                    status: "COMPLETED"
                  }
                }
              }).then((res) => {
                console.log(res);
                
            })
            .catch((err) => {
                console.log(err);
            });
            }
          }).catch((err) => {
            console.log(err);
            
          })
        }

        console.log("Assigner: ", assigner);
        
        
        
        const changeStateFunction = async (status) => {
          setCompleted(status);
          setTimeout(() => {
            setTaskAdd(true)
          }, 1000)
        

          if(status === true) {
            if(item.comments.length === 0) {
              await axios.put(`http://localhost:8082/api/v1/task/changeTaskStatus/${item.taskId}`)
              .then((res) => {
                console.log(res.data);
              })
            } else {
              await axios.put(`http://localhost:8082/api/v1/task/changeTaskStatus/${item.taskId}`)
              .then((res) => {
                console.log(res.data);
              })
            }
          } else {
            if(item.comments.length === 0) {
              await axios.put(`http://localhost:8082/api/v1/task/changeTaskStatus/${item.taskId}`)
              .then((res) => {
                console.log(res.data);
              })
            } else {
              await axios.put(`http://localhost:8082/api/v1/task/changeTaskStatus/${item.taskId}`)
              .then((res) => {
                console.log(res.data);
              })
            }
          }
        
          updateWorkStatus("complete")
        }

  useEffect(() => {
    console.log("Completed status updated:", completed);
  }, [completed, item, comment]);


  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.taskName);
  const [newDesc, setNewDesc] = useState(item.description);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newCollaborators, setNewCollaborators] = useState(item.collaboratorIds);
  const [newTeams, setNewTeams] = useState(item.teamIds);

  useEffect(() => {
    setSelectedMembers(taskMembers ?? []);  // Ensure it's never undefined
  }, [taskMembers]);

  console.log("Selected Members: ", selectedMembers);
  console.log("New Collaborators: ", newCollaborators);
  console.log("New Teams: ", newTeams);

  const handleDoubleClick = () => {
    setIsEditing(true);
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
        assignerId: item.assignerId,
        priority: item.priority,
        dueDate: item.dueDate,
        projectId: item.projectId,
        collaboratorIds: newCollaborators,
        teamIds: newTeams,
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

  const handleBlur = async (newValue) => {
    const formattedDate = dayjs(newValue);
    newValue ? setSelectedDate(formattedDate) : setSelectedDate(dayjs(item.dueDate));
    setIsEditing(false);  

    console.log("Selected Members: ", selectedMembers);
    console.log("New Collaborators: ", newCollaborators);
    console.log("New Teams: ", newTeams);
    console.log(item.collaboratorIds);
    console.log(item.teamIds);
    


    await axios.put("http://localhost:8082/api/v1/task/updateTask", {
      taskId: item.taskId,
      taskName: newName,
      description: newDesc,
      assignerId: item.assignerId,
      priority: item.priority,
      dueDate: formattedDate.format('YYYY-MM-DD'),
      projectId: item.projectId,
      collaboratorIds: newCollaborators ? newCollaborators : [],
      teamIds: newTeams ? newTeams : [],
      memberIcons: item.memberIcons,
      tags: item.tags,
      workId: item.workId,
      status: completed
    }).then((res) => {
      console.log(res.data);
      toggleDrawer(true);
    }).catch((err) => {
      console.log(err);
    })
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const deleteTask = async () => {
    await axios.delete(`http://localhost:8082/api/v1/task/deleteTask/${item.taskId}`)
    .then((res) => {
      console.log(res.data);
      setTaskAdd(true);
    }).then(() => {
      updateWorkStatus("delete");
    }
    ).catch((err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    })
  }


    //use state enum to check for which updation
    const [openUpdate, setOpenUpdate] = useState({ state: false, type: "all", data: item });

  const DrawerList = (
    <DrawerContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <IcoBtn onClick={() => {toggleDrawer(false); setEditTask(true);}}>
        <KeyboardDoubleArrowRightIcon/>
      </IcoBtn>
      <div style={{ display: 'flex', gap: '5px' }}>
      <Button sx={{ backgroundColor: item.status == true ? '#07bf07' : 'transparent', border: '1px solid #000', color: '#000', fontSize: "13px" }} onClick={() => changeStateFunction(!completed)} ><CheckIcon sx={{ fontSize: "20px", marginRight: "5px" }} />  Mark Complete</Button>
      <IcoBtn style={{ backgroundColor: 'orange', color: '#000 !important' }} onClick={() => setOpenUpdate({ state: true, type: 'all', data: item })}>
        <EditNoteIcon />
      </IcoBtn>
      <IcoBtn style={{ backgroundColor: 'red', color: '#000' }} onClick={() => {toggleDrawer(false); deleteTask(true);}}>
        <DeleteForeverIcon />
      </IcoBtn>
      </div>
      </Box>
      <Box sx={{ width: 500 }} role="presentation">
          <top>
          {isEditing ? (
            <input
                style={{ fontSize: "2em", fontWeight: "700", border: "none", outline: "none", margin: "0.67em 0", backgroundColor: 'transparent' }}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              
            />
            ) : (
              <h1 onDoubleClick={handleDoubleClick}>{newName}</h1>
            )}
          </top>

          {isEditing ? (
            <input
                style={{ fontSize: "14px", fontWeight: "400", border: "none", outline: "none", marginTop: "4px", backgroundColor: 'transparent' }}
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              
            />
            ) : (
              <Desc onDoubleClick={handleDoubleClick}>{newDesc}</Desc>
            )}
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
          <h3 style={{ margin: '0' }}>Assigner: </h3> 
          {assigner.length != 0 && (
            <Avatar
            sx={{
              marginLeft: "5px",
              width: "26px",
              height: "26px",
              fontSize: "16px",
            }}
          >
            {assigner?.userName.charAt(0)}
          </Avatar>
          )}
          </Box>

          <Box sx={{ display: 'flex', paddingTop: '20px' }}>
          <h3 style={{ margin: '0' }}>Collaborators: </h3> 
            <AvatarGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", gap: '10px', alignItems: 'flex-start', paddingLeft: '20px' }}>

            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={allWorkMembers ?? []}
              getOptionLabel={(option) => option.name}
              value={selectedMembers}
              onChange={(event, newValue) => {
                setSelectedMembers(newValue ? [...newValue] : selectedMembers);

                console.log("New Value: ", newValue);
                
            
                if(newValue.map((m) => m.type).includes("collaborator")) {
                  // Merge existing and new collaborators
                setNewCollaborators((prev) => [
                  ...new Set([
                    ...prev, // Keep existing collaborators
                    ...newValue
                      .filter((member) => member.type === "collaborator")
                      .map((m) => m.id),
                  ]),
                ]);
            
                // Merge existing and new teams
                setNewTeams((prev) => [
                  ...new Set([
                    ...newValue
                      .filter((member) => member.type === "team")
                      .map((m) => m.id),
                  ]),
                ]);
                } 
                if(newValue.map((m) => m.type).includes("team")) {
                  // Merge existing and new collaborators
                setNewCollaborators((prev) => [
                  ...new Set([
                    ...newValue
                      .filter((member) => member.type === "collaborator")
                      .map((m) => m.id),
                  ]),
                ]);
            
                // Merge existing and new teams
                setNewTeams((prev) => [
                  ...new Set([
                    ...prev, // Keep existing teams
                    ...newValue
                      .filter((member) => member.type === "team")
                      .map((m) => m.id),
                  ]),
                ]);
                } 
                if(!newValue.map((m) => m.type).includes("team") || !newValue.map((m) => m.type).includes("collaborator")) {
                    // Merge existing and new collaborators
                setNewCollaborators((prev) => [
                  ...new Set([
                    ...newValue
                      .filter((member) => member.type === "collaborator")
                      .map((m) => m.id),
                  ]),
                ]);
            
                // Merge existing and new teams
                setNewTeams((prev) => [
                  ...new Set([
                    ...newValue
                      .filter((member) => member.type === "team")
                      .map((m) => m.id),
                  ]),
                ]);
                }
              }}
              onBlur={() => handleBlur(selectedDate)}
              renderInput={(params) => <TextField {...params} placeholder="Select members" />}
              sx={{ width: 'auto' }}
            />

            </AvatarGroup>
          </Box>
          
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px'}}>
          <h3 style={{ margin: '0' }}>Due Date: </h3> 
          <Box style={{ marginTop: "0px" }}>

          {isEditing ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={handleBlur}
                format="YYYY-MM-DD"
                minDate={dayjs()} // Restricts selection to today and future dates
                // sx={{
                //   '& .MuiInputBase-root': { color: '#fff' },
                //   '& .MuiInput-underline:before': { borderBottomColor: '#fff' },
                //   '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#fff' },
                //   '& .MuiInput-underline:after': { borderBottomColor: '#fff' },
                //   '& .MuiSvgIcon-root': { color: '#fff' },
                //   '& .css-1dune0f-MuiInputBase-input-MuiOutlinedInput-input': { width: '40%' },
                //   '& .css-npzfd0-MuiFormControl-root-MuiTextField-root': { width: '70%' },
                //   '& .css-jupps9-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                //   '& .css-jupps9-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                // }}
              />
            </LocalizationProvider>
          ) : (
            <p 
              onDoubleClick={handleDoubleClick} 
              style={{ 
                margin: '0', 
                padding: '0 5px',
                color: selectedDate
                  ? selectedDate.isSame(dayjs(), 'day')
                    ? 'green'
                    : selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')
                    ? 'red'
                    : selectedDate.isSame(dayjs().add(1, 'day'), 'day')
                    ? 'orange'
                    : 'black' // Default text color
                  : 'black' // If no date is selected
              }}
            >
              {selectedDate
                ? selectedDate.isSame(dayjs(), 'day')
                  ? 'Today'
                  : selectedDate.isSame(dayjs().subtract(1, 'day'), 'day')
                  ? 'Yesterday'
                  : selectedDate.isSame(dayjs().add(1, 'day'), 'day')
                  ? 'Tomorrow'
                  : selectedDate.format('DD-MM-YYYY')
                : 'No Date Selected'}
            </p>
          )}



            </Box>
          </Box>

          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px'}}>
          <h3 style={{ margin: '0' }}>Project: </h3> 
          <h3 style={{ margin: '0', padding: '0 5px' }}>#{project.projectId} - {project?.projectName}</h3>
                

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
    {openUpdate.state && <UpdateTask setUpdateWorkFromTask={setUpdateWorkFromTask} setEditTask={setEditTask} editTask={editTask} openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} type={openUpdate.type} />}

    {item && (
            <Container className={"item"}>
            <Top>

              <Checkbox checked={completed} style={{ borderRadius: '100px', padding: '0', color: completed ? 'green' : 'orange'  }} onClick={() => changeStateFunction(!completed)} /> 

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

            <Drawer 
              anchor="right" 
              open={open} 
              onClose={() => {toggleDrawer(false);  setEditTask(true)}}
              TransitionComponent={Slide}
              transitionDuration={1000}
             >
              {DrawerList}
            </Drawer>
          </Container>
    )}
    </>
  );
};



export default TaskCard;
