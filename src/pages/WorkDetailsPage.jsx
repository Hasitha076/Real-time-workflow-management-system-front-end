import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  Add,
  AlignHorizontalLeft,
  AlignVerticalTop,
  CheckCircleOutlineOutlined,
  Delete,
  DonutLarge,
  Edit,
  PersonAdd,
} from "@mui/icons-material";
import { tagColors } from "../data/data";
import MemberCard from "../components/MemberCard";
import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import DeletePopup from "../components/DeletePopup";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import InviteWorkMembers from "../components/InviteWorkMembers";
import UpdateWork from "../components/UpdateWork";
import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import QueueIcon from '@mui/icons-material/Queue';
import { Button, Divider } from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';

import { Menu, MenuItem } from "@mui/material";
import AddNewProject from "../components/AddNewProject";
import AddNewTask from "../components/AddNewTask";
import { LOAD_PROJECT_BY_ID } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div``;

const Options = styled(MenuItem)`
  display: flex;
  gap: 10px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
  @media screen and (max-width: 480px) {
    margin: 6px 0px;
    flex-direction: column;
  }
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  margin-bottom: 4px;
`;

const SubTitle = styled.div`
  font-size: 24px;
  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DropdownText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.soft2};
  padding: 10px 10px;
`;

const Title = styled.div`
  font-size: 24px;
  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
  font-weight: 500;
  color: ${({ theme }) => theme.text};
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

const Desc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
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

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 6px;
  margin-top: 14px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 12px;
  font-weight: 500;
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

const Hr = styled.hr`
  margin: 18px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
  gap: 20px;
`;

const Work = styled.div`
  flex: 1.6;
`;

const Allignment = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ToggleButton = styled.div`
  padding: 0px 16px;
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  border-radius: 5px;
  ${(props) => {
    if (props.button == "row") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.soft2};`;
    }
    if (props.button == "col") {
      return `border-radius: 0px 5px 5px 0px; border: 2px solid ${props.theme.soft2};`;
    }
  }}
  ${(props) => {
    if (props.alignment && props.button == "row") {
      return `border-radius: 5px 0px 0px 5px; border: 2px solid ${props.theme.primary
        }; color: ${props.theme.primary}; background-color: ${props.theme.primary + "11"
        };`;
    }
    if (!props.alignment && props.button == "col") {
      return `border-radius: 0px 5px 5px 0px; border: 2px solid ${props.theme.primary
        }; color: ${props.theme.primary}; background-color: ${props.theme.primary + "11"
        };`;
    }
  }}
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;

  @media screen and (max-width: 480px) {
    width: 94%;
  }
  padding: 4px 8px;
  text-align: left;
  margin: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  margin-bottom: 4px;
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.soft2};
  font-weight: 400;
  margin-left: 8px;
`;

const Wrapper = styled.div`
  padding: 12px 0px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 12px;
`;

const AddNewButton = styled.div`
  padding: 5px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.primary + "33"};
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;

const HrHor = styled.div`
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const IcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const Extra = styled.div`
  flex: 1;
`;

const SubCards = styled.div`
  padding: 10px 12px 18px 12px;
  text-align: left;
  margin: 12px 0px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card + "99"};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
`;

const SubCardTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 3px 4px;
  color: ${({ theme }) => theme.text};
`;

const SubCardsTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 8px;
`;

const Ideas = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 8px;
`;

const WorkDetailsPage = () => {
  const { id } = useParams();
  const [item, setItems] = useState([]);
  const [projectCollaborators, setProjectCollaborators] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [workCollaboratorIds, setWorkCollaboratorIds] = useState([]);
  const [workTeamIds, setWorkTeamIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitePopup, setInvitePopup] = useState(false);
  const [currentWork, setCurrentWork] = useState({});
  const [openWork, setOpenWork] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [teams, setTeams] = useState([]);
  const [works, setWorks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [workCollaborators, setWorkCollaborators] = useState([]);
  const [workTeams, setWorkTeams] = useState([]);
  const [taskCollaborators, setTaskCollaborators] = useState([]);
  const [taskTeams, setTaskTeams] = useState([]);
  const [newTask, setNewTask] = useState(false);
  const [taskAdd, setTaskAdd] = useState(false);
  const [collaboratorBlock, setCollaboratorBlock] = useState({});
  const [editTask, setEditTask] = useState(false);
  
      const [anchorEl, setAnchorEl] = useState(null);
      const openDropdown = Boolean(anchorEl);
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      useEffect(() => {
        if (taskAdd) {
          getTasks();
          setTaskAdd(false);
        }
        if(editTask){
          getTasks();
          setEditTask(false);
        }
      }, [taskAdd, editTask]);
  
  
  //hooks for updates
  //use state enum to check for which updation
  const [openUpdate, setOpenUpdate] = useState({ state: false, type: "all", data: item });

  //use state for delete popup
  const [openDelete, setOpenDelete] = useState({ state: false, type: "Work", data: item });

  const dispatch = useDispatch();

  const getproject = async (id) => {
    await axios.get(`http://localhost:8086/api/v1/work/getWork/${id}`)
      .then((res) => {
        setItems(res.data);
        setWorkCollaboratorIds(res.data.collaboratorIds);
        setWorkTeamIds(res.data.teamIds);
      })
      .then(() => {
          setLoading(false);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };

  const { error, data } = useQuery(LOAD_PROJECT_BY_ID, {
    variables: { id: parseInt(item.projectId) },  // Ensure ID is an integer
    skip: !id,  // Avoid sending query if ID is undefined
    fetchPolicy: "cache-and-network" // Ensures fresh data is fetched
  });

  const getCollaborators = async () => {
    await axios.get(`http://localhost:8081/api/v1/user/getAllUsers`)
      .then((res) => {
        setCollaborators(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTeams = async () => {
    await axios.get(`http://localhost:8085/api/v1/team/getAllTeams`)
      .then((res) => {
        setTeams(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTasks = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getAllTasks`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWorks = async () => {
    await axios.get(`http://localhost:8086/api/v1/work/getWorksByProjectId/${id}`)
    .then((res) => {    
      setWorks(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const getTaskTemplates = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getTaskTemplatesByProjectId/${item.projectId}`)
      .then((res) => {
        setTaskTemplates(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    
    if (data?.getProject) {
      setProjectCollaborators((prev) => [...data.getProject.collaboratorIds || []]);
      setProjectTeams((prev) => [...data.getProject.teamIds || []]);
    }
  }, [loading, data]);

  useEffect(() => {
    const updateData = async () => {
      await Promise.all([getCollaborators(), getTeams(), getWorks(), getTasks(), getTaskTemplates()]);
      if (item?.projectId) {
        
      }
    };
  
    updateData();
  }, [item?.projectId, id]);

  
  const matchingWorkCollaborators = useMemo(() => {
    if (item?.collaboratorIds && collaborators.length > 0) {
      return collaborators
        .filter((user) => projectCollaborators.includes(user.userId))
        .map((user) => ({
          id: user.userId,
          name: user.userName,
          email: user.email,
        }));
    }
    return [];
  }, [item, collaborators, projectCollaborators]);

  const matchingTaskCollaborators = useMemo(() => {
    if (item?.collaboratorIds && collaborators.length > 0) {
      return collaborators
        .filter((user) => workCollaboratorIds.includes(user.userId))
        .map((user) => ({
          id: user.userId,
          name: user.userName,
          email: user.email,
        }));
    }
    return [];
  }, [item, collaborators, workCollaboratorIds]);

  const matchingWorkTeams = useMemo(() => {
    if (item?.teamIds && teams.length > 0) {
      return teams
        .filter((team) => projectTeams.includes(team.teamId))
        .map((team) => ({
          id: team.teamId,
          name: team.teamName,
        }));
    }
    return [];
  }, [item, teams, projectTeams]);

  const matchingTaskTeams = useMemo(() => {
    if (item?.teamIds && teams.length > 0) {
      return teams
        .filter((team) => workTeamIds.includes(team.teamId))
        .map((team) => ({
          id: team.teamId,
          name: team.teamName,
        }));
    }
    return [];
  }, [item, teams, workTeamIds]);

  useEffect(() => {
    setWorkCollaborators(matchingWorkCollaborators);
    setTaskCollaborators(matchingTaskCollaborators);
    setWorkTeams(matchingWorkTeams);
    setTaskTeams(matchingTaskTeams);
    
  }, [matchingWorkCollaborators, matchingTaskCollaborators, matchingWorkTeams, matchingTaskTeams]);


  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getproject(id); 
  }, [id, openWork, openUpdate, invitePopup]);

  const [alignment, setAlignment] = useState(true);

  console.log(taskTemplates);
  console.log(projectCollaborators);
  console.log(projectTeams);
  console.log(works);
  
  
  

  //create new work card
  const createTaskCard = async (template) => {
    try {
        setLoading(true);
        let collaboratorBlock = null;

        // Fetch existing collaborators block
        try {
            const res = await axios.get(`http://localhost:8082/api/v1/task/getCollaboratorsBlock/${item.workId}`);
            if (res.status === 200) {
                collaboratorBlock = res.data;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No collaborators block found, using template data.");
            } else {
                throw error; // Unexpected error
            }
        }

        // Create new task card object
        let newTaskCard = {
            taskName: template.taskTemplateName,
            description: template.taskTemplateDescription,
            tags: template.taskTemplateTags,
            priority: template.taskTemplatePriority,
            projectId: template.projectId,
            workId: item.workId,
            dueDate: template.taskTemplateDueDate,
            collaboratorIds: collaboratorBlock?.memberIds || template.taskTemplateCollaboratorIds,
            teamIds: collaboratorBlock?.teamIds || template.taskTemplateTeamIds,
        };

        // Create Task Card
        await axios.post("http://localhost:8082/api/v1/task/createTask", newTaskCard);

        // Update Work
        await axios.put(`http://localhost:8086/api/v1/work/updateWork`, {
            workId: item.workId, 
            workName: item.workName, 
            description: item.description, 
            priority: item.priority,
            projectId: item.projectId,
            dueDate: item.dueDate,
            collaboratorIds: item.collaboratorIds,
            teamIds: item.teamIds,
            memberIcons: item.memberIcons,
            status: false,
            tags: item.tags
        });

        // Success Message
        dispatch(
            openSnackbar({
                message: "Created a task card successfully",
                severity: "success",
            })
        );

    } catch (err) {
        console.error("Error:", err);
        dispatch(
            openSnackbar({
                message: err.message,
                severity: "error",
            })
        );
    } finally {
        setLoading(false);
        setNewTask(false);
        setTaskAdd(true);
    }
};

  


  return (
    <Container>
      {openUpdate.state && <UpdateWork openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} type={openUpdate.type} />}
      {openDelete.state && <DeletePopup openDelete={openDelete} setOpenDelete={setOpenDelete} />}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px',height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Header>
            <Title>{item.workName}</Title>
            <Desc>{item.description}</Desc>
            <Tags>
              {item.tags.map((tag) => (
                <Tag
                  tagColor={
                    tagColors[Math.floor(Math.random() * tagColors.length)]
                  }
                >
                  {tag}
                </Tag>
              ))}
            </Tags>
            <Members>
              <AvatarGroup>
                {item.memberIcons.map((member) => (
                  <Avatar
                    sx={{ marginRight: "-12px", width: "38px", height: "38px" }}
                  >
                    {member.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
              <InviteButton onClick={() => setInvitePopup(true)}>
                <PersonAdd sx={{ fontSize: "12px" }} />
                Invite
              </InviteButton>
            </Members>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <IcoBtn onClick={() => setOpenUpdate({ state: true, type: 'all', data: item })}>
                <Edit sx={{ fontSize: "20px" }} />
              </IcoBtn>
              <IcoBtn onClick={() => setOpenDelete({ state: true, type: 'Work', name: item.workName, id: item.workId, projectId: item.projectId })}>
                <Delete sx={{ fontSize: "20px" }} />
              </IcoBtn>
            </div>

            <Hr />
            {invitePopup && (
              <InviteWorkMembers
                setInvitePopup={setInvitePopup}
                id={id}
                teamInvite={false}
                setLoading={setLoading}
                data={item}
                projectCollaboratorIds={projectCollaborators}
                projectTeamIds={projectTeams}
                workCollaborators={workCollaborators}
                workTeams={workTeams}
              />
            )}
          </Header>
          <Body>
            <Work>
              <Allignment>
                <ToggleButton
                  alignment={alignment}
                  button={"row"}
                  onClick={() => setAlignment(true)}
                >
                  <AlignVerticalTop sx={{ fontSize: "18px" }} />
                </ToggleButton>
                <ToggleButton
                  alignment={alignment}
                  button={"col"}
                  onClick={() => setAlignment(false)}
                >
                  <AlignHorizontalLeft sx={{ fontSize: "18px" }} />
                </ToggleButton>
              </Allignment>
              <Column alignment={alignment}>
                <ItemWrapper>
                <Heading>
                    <SubTitle>
                      All Tasks
                    </SubTitle>

                  <Button
                      sx={{
                        borderRadius: "10px",
                        border: "1px solid rgb(205 50 198)",
                        color: "rgb(205 50 198)",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        gap: "5px",
                        "&:hover": {
                          backgroundColor: "rgb(205 50 198)",
                          color: "white",
                        },
                      }}
                      onClick={handleClick} // Open dropdown on click
                    >
                    <QueueIcon sx={{ fontSize: "15px" }} />
                    Add New Task
                  </Button>

                  {/* Dropdown Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    style={{ marginTop: "10px", width: "100%" }}
                  >
                    <Options onClick={() => {setNewTask(true); handleClose()}}>Black Task</Options>
                    <Divider />
                    <DropdownText> Task Templates</DropdownText>
                    {taskTemplates?.map((template) => (
                      <Options onClick={() => {createTaskCard(template); handleClose()}}>
                      <AddTaskIcon /> {template.taskTemplateName}
                    </Options>
                    ))}
                    
                  </Menu>
                  </Heading>
                  <Top>
                    <Text>
                      <DonutLarge sx={{ color: "#1976D2", fontSize: "20px" }} />
                      In Progress
                      <Span>(
                        {
                          tasks?.filter(
                            (task) => task.status === false && task.workId === item.workId
                          ).length
                        }
                        )</Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">

                    {tasks?.filter((task) => task.status === false && task.workId === item.workId && task.projectId === item.projectId)
                      .map((filteredItem) => (
                          <TaskCard
                            status="In Progress"
                            projectId={item.projectId}
                            item={filteredItem}
                            members={collaborators}
                            teams={teams}
                            setTaskAdd={setTaskAdd}
                            work={item}
                            tasks={tasks}
                            setEditTask={setEditTask}
                          />
                      ))}
                  </Masonry>
                  </ResponsiveMasonry>
                </ItemWrapper>
                <ItemWrapper>
                  <Top>
                    <Text>
                      <CheckCircleOutlineOutlined
                        sx={{ color: "#67BC6D", fontSize: "20px" }}
                      />
                      Completed

                      <Span>(
                        {
                          tasks?.filter(
                              (task) =>  task.status === true && task.workId === item.workId && task.projectId === item.projectId
                            ).length
                        }
                        )</Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">
                    {tasks?.filter((task) => task.status === true && task.workId === item.workId)
                      .map((filteredItem) => (
                          <TaskCard
                            status="Completed"
                            item={filteredItem}
                            projectId={item.projectId}
                            members={collaborators}
                            teams={teams}
                            setTaskAdd={setTaskAdd}
                            work={item}
                            tasks={tasks}
                          />
                      ))}
                 </Masonry>
                 </ResponsiveMasonry>
                </ItemWrapper>
              </Column>
            </Work>
            <HrHor />
            <Extra>
              <SubCards>
                <SubCardTop>
                  <SubCardsTitle>Members</SubCardsTitle>
                  <IcoBtn onClick={() => setOpenUpdate({ state: true, type: 'member', data: item })} >
                    <Edit sx={{ fontSize: "16px" }} />
                  </IcoBtn>
                </SubCardTop>
                {item.collaboratorIds.map((id) => (
                  collaborators.map((collaborator) => {
                    if (id === collaborator.userId) {
                      return <MemberCard member={collaborator} />;
                    }
                  }
                ))
              )}
            
              </SubCards>
              <SubCards>
                <SubCardTop>
                  <SubCardsTitle>Teams</SubCardsTitle>
                  <IcoBtn onClick={() => setOpenUpdate({ state: true, type: 'member', data: item })} >
                    <Edit sx={{ fontSize: "16px" }} />
                  </IcoBtn>
                </SubCardTop>
                {item.teamIds.map((id) => (
                  teams.map((team) => {
                    if (id === team.teamId) {
                      return <MemberCard member={team} />;
                    }
                  }
                ))
              )}
              </SubCards>
              
            </Extra>
          </Body>
        </>
      )}

      {newTask && <AddNewTask 
        setNewTask={setNewTask} 
        WorkMembers={taskCollaborators}
        WorkTeams={taskTeams}
        ProjectId={item.projectId}
        WorkId={item.workId}
        data={item}
        setTaskAdd={setTaskAdd}
        tasks={tasks}
        
        />}
    </Container>
  );
};

export default WorkDetailsPage;
