import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { Button } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DiscountIcon from '@mui/icons-material/Discount';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import FeedIcon from '@mui/icons-material/Feed';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from '@mui/material/Box';
import {Drawer, Slide} from '@mui/material';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import workflow from "../Images/workflow.png";
import InviteWorkflowMembers from "../components/InviteWorkflowMembers";
import { useQuery } from "@apollo/client";
import { LOAD_PROJECT_BY_ID } from "../GraphQL/Queries";
import { HiArrowDown } from "react-icons/hi";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelIcon from '@mui/icons-material/Cancel';
import TriggerFunctionCards from "../components/TriggerFunctionCards";
import ActionFunctionCards from "../components/ActionFunctionCards";
import TriggerRuleCard from "../components/TriggerRuleCard";
import ActionRuleCard from "../components/ActionRuleCard";
import PublishIcon from '@mui/icons-material/Publish';
import AddTaskTemplate from "../components/AddTaskTemplate";
import AddForm from "../components/AddForm";
import { useLocation } from 'react-router-dom';


const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div`
  position: relative;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
  @media screen and (max-width: 480px) {
    margin: 6px 0px;
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 30px;
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

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
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
  flex: 2;
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
  align-items: flex-start;
  margin-bottom: 30px;
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubText = styled.div`
  font-size: 30px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Customizer = styled.button`

`;

const HrHor = styled.div`
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;


const ArrowIcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const Extra = styled.div`
  flex: 1;
`;


const DrawerContainer = styled.div`
  padding: 30px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const Image = styled.img`
  height: 50px;
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


const Rule = () => {
  const { id } = useParams();
  const [item, setItems] = useState([]);
  const [projectCollaborators, setProjectCollaborators] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [inviteMemberPopup, setInviteMemberPopup] = useState(false);
  const [inviteTeamPopup, setInviteTeamPopup] = useState(false);
  const [created, setCreated] = useState(false);
  const [currentWork, setCurrentWork] = useState({});
  const [openWork, setOpenWork] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [teams, setTeams] = useState([]);
  const [works, setWorks] = useState([]);
  const [alignment, setAlignment] = useState(true);
  const [open, setOpen] = useState(false);
  const [newForm, setNewForm] = useState(false);
  const [newTaskTemplate, setNewTaskTemplate] = useState(false);
  const [workDetails, setWorkDetails] = useState({});
  const [taskTemplateAdded, setTaskTemplateAdded] = useState(false);
    const [taskTemplates, setTaskTemplates] = useState([]);
    const [publishFlow, setPublishFlow] = useState({});

  const location = useLocation();
  const existingRule = location.state?.existingRule;
    const existingRuleDetails = location.state?.ruleDetails;

    console.log(existingRule);
    console.log(existingRuleDetails);
    
  const [ruleDetails, setRuleDetails] = useState(existingRuleDetails);

  console.log("Rule details ===> ", ruleDetails);
  
  

  const { loading, error, data } = useQuery(LOAD_PROJECT_BY_ID, {
    variables: { id: parseInt(id) },  // Ensure ID is an integer
    skip: !id,  // Avoid sending query if ID is undefined
    fetchPolicy: "cache-and-network" // Ensures fresh data is fetched
  });
  
  //use state enum to check for which updation
  const [openUpdate, setOpenUpdate] = useState({ state: false, type: "all", data: item });

  //use state for delete popup
  const [openDelete, setOpenDelete] = useState({ state: false, type: "Project", data: item });

  const dispatch = useDispatch();
  
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    const navigate = useNavigate();

        useEffect(() => {
          
          if (!loading && data?.getProject) {
            setItems((prev) => ({ ...prev, ...data.getProject }));
            setProjectCollaborators((prev) => [...data.getProject.collaboratorIds || []]);
            setProjectTeams((prev) => [...data.getProject.teamIds || []]);
          }
        }, [loading, data]);


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

  const getWorks = async () => {
    await axios.get(`http://localhost:8086/api/v1/work/getWorksByProjectId/${id}`)
    .then((res) => {
      console.log(res.data);
      
        if(res.data !== null){
          setWorks(res.data);
        } else {
          setWorks([]);
        }

    })
    .catch((err) => {
      console.log(err);
    });
  }

    const getTaskTemplates = async () => {
      await axios.get(`http://localhost:8082/api/v1/task/getTaskTemplatesByProjectId/${id}`)
        .then((res) => {
          setTaskTemplates(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getRuleFlows = async () => {
        await axios.get(`http://localhost:8082/api/v1/task/getPublishFlowByRuleId/${existingRuleDetails.ruleId}`)
          .then((res) => {
            setPublishFlow(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
    };

      console.log("PublishRules: ", publishFlow);
      
  
  useEffect(() => {
    getCollaborators();
    getTeams();
    getWorks();
    getTaskTemplates();
    if(existingRuleDetails){
        getRuleFlows();
    }
  }, [item, id]);


  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openWork, openUpdate, inviteMemberPopup, id]);


  const [triggerHandle, setTriggerHandle] = useState(true);
  const [actionHandle, setActionHandle] = useState(false);
  const [triggers, setTriggers] = useState(() => 
    (ruleDetails?.triggers?.length > 0 ? 
      ruleDetails.triggers.map((ele, index) => ({
        id: index + 1,
        name: `Trigger ${index + 1}`,
        type: "trigger",
        status: "active",
        triggerDetails: ele.triggerDetails,
      })) 
      : [{
        id: 1,
        name: 'Trigger 1',
        type: 'trigger',
        status: 'active',
        triggerDetails: {},
      }]
    )
  );
  

const [actions, setActions] = useState(() =>
  (ruleDetails?.actions?.length > 0 
    ? ruleDetails.actions.map((ele, index) => ({
        id: index + 1,
        name: `Action ${index + 1}`,
        type: "action",
        status: "inactive",
        actionDetails: ele.actionDetails,
      }))
    : [{
        id: 1,
        name: 'Action 1',
        type: 'action',
        status: 'inactive',
        actionDetails: {},
      }]
  )
);

  const [activeTrigger, setActiveTrigger] = useState(triggers[0]);
  const [activeAction, setActiveAction] = useState(actions[0]);
  const [isActiveTrigger, setIsActiveTrigger] = useState(true);
  const [isActiveAction, setIsActiveAction] = useState(false);

  const addTrigger = () => {
    console.log("Add Trigger");
    console.log("Actions:", actions);
    console.log("Triggers:", triggers);

    const updatedActions = actions.map((ele) => ({ ...ele, status: "inactive" }));
    setActions(updatedActions);

    const updatedTriggers = triggers.map((ele) => ({ ...ele, status: "inactive" }));

    const newId = triggers.length > 0 ? triggers[triggers.length - 1].id + 1 : 1;

    const newTrigger = {
      id: newId,
      name: `Trigger ${newId}`,
      type: "trigger",
      status: "active",
      triggerDetails: {},
    };

    setTriggers([...updatedTriggers, newTrigger]);
    setActiveTrigger(newTrigger);
  };

  const deleteTrigger = (id, status) => {
    if (status === "inactive" && triggers.length > 1) {
      const result = triggers.filter((ele) => ele.id !== id);
      if (result.length === 0) {
        setTriggers([
          {
            id: 1,
            name: "Trigger 1",
            type: "trigger",
            status: "active",
            triggerDetails: {},
          },
        ]);
      } else {
        setTriggers(result);
      }
    }
  };

  const triggerEventHandle = (ele) => {
    console.log("Trigger Event Handle");
    setIsActiveTrigger(true);
    setIsActiveAction(false);

    const updatedActions = actions.map((a) => ({ ...a, status: "inactive" }));
    setActions(updatedActions);

    const updatedTriggers = triggers.map((item) => {
      if (item.id === ele.id) {
        return {
          ...item,
          status: "active",
          triggerDetails: { ...ele.triggerDetails },
        };
      }
      return { ...item, status: "inactive" };
    });
    setTriggers(updatedTriggers);
    setActiveTrigger(ele);
  };

  const addAction = () => {
    console.log("Add Action");
    console.log("Actions:", actions);
    console.log("Triggers:", triggers);

    const updatedTriggers = triggers.map((trigger) => ({ ...trigger, status: "inactive" }));
    setTriggers(updatedTriggers);

    const updatedActions = actions.map((action) => ({ ...action, status: "inactive" }));

    const newId = actions.length > 0 ? actions[actions.length - 1].id + 1 : 1;

    const newAction = {
      id: newId,
      name: `Action ${newId}`,
      type: "action",
      status: "active",
      actionDetails: {},
    };

    setActions([...updatedActions, newAction]);
    setActiveAction(newAction);
  };

  const deleteAction = (id, status) => {
    if (status === "inactive" && actions.length > 1) {
      const result = actions.filter((ele) => ele.id !== id);
      if (result.length === 0) {
        setActions([
          {
            id: 1,
            name: "Action 1",
            type: "action",
            status: "active",
            actionDetails: {},
          },
        ]);
      } else {
        setActions(result);
      }
    }
  };

  const actionEventHandle = (ele) => {
    console.log("Action Event Handle");
    setIsActiveAction(true);
    setIsActiveTrigger(false);

    const updatedTriggers = triggers.map((t) => ({ ...t, status: "inactive" }));
    setTriggers(updatedTriggers);

    const updatedActions = actions.map((item) => {
      if (item.id === ele.id) {
        return {
          ...item,
          status: "active",
          actionDetails: { ...ele.actionDetails },
        };
      }
      return { ...item, status: "inactive" };
    });
    setActions(updatedActions);
    setActiveAction(ele);
  };

  useEffect(() => {
    if (triggerHandle) {
      const updated = actions.map((item) => ({ ...item, status: "inactive" }));
      setActions(updated);
    } else {
      const updated = triggers.map((item) => ({ ...item, status: "inactive" }));
      setTriggers(updated);
    }
  }, [triggerHandle, actionHandle]);

  useEffect(() => {
    if (isActiveTrigger) {
      console.log("Trigger is active");
      triggerEventHandle(activeTrigger);
    } else if (isActiveAction) {
      console.log("Action is active");
      actionEventHandle(activeAction);
    }
  }, [isActiveTrigger, isActiveAction, activeTrigger, activeAction]);
  

    const createRule = async () => {
        const triggerData = triggers.map((ele) => ({
            ...ele,
            triggerDetails: { ...ele.triggerDetails },
        }));
    
        const actionData = actions.map((ele) => ({
            ...ele,
            actionDetails: { ...ele.actionDetails },
        }));
    
        const data = {
            ruleName: "Rule 1",
            projectId: item.projectId,
            triggers: triggerData,
            actions: actionData,
            status: "inactive",
        };
    
        console.log(data);
    
        await axios.post(`http://localhost:8082/api/v1/task/createRule`, data)
            .then((res) => {
            console.log(res.data);
            
            dispatch(
                openSnackbar({
                    message: "Rule created successfully",
                    type: "success",
                })
            );
            navigate(`/rules/${item.projectId}`);

            setTriggers([{
                id: 1,
                name: "Trigger 1",
                type: "trigger",
                status: "active",
                triggerDetails: {},
            }]);
            setActions([{
                id: 1,
                name: "Action 1",
                type: "action",
                status: "inactive",
                actionDetails: {},
            }]);
            setActiveTrigger({});
            setActiveAction({});
            })
            .catch((err) => {
            console.log(err);
            dispatch(openSnackbar({ open: true, message: "Error Creating Workflow", type: "error" }));
            });
    }

    const publish = async () => {
        console.log(ruleDetails);

        if (publishFlow.publishFlowId === undefined) {
            console.log("New published workFlow");

            const triggerData = ruleDetails.triggers.map((ele) => ({
                ...ele,
                triggerDetails: { ...ele.triggerDetails },
            }));
            
            const actionData = ruleDetails.actions.map((ele) => ({
                ...ele,
                actionDetails: { ...ele.actionDetails },
            }));
            
    
            const data = {
                publishFlowName: "Publish " + ruleDetails.ruleName,
                ruleId: ruleDetails.ruleId,
                projectId: ruleDetails.projectId,
                triggers: triggerData,
                actions: actionData,
                status: "active",
            };

            await axios.post(`http://localhost:8082/api/v1/task/createPublishFlow`, data)
            .then((res) => {
            console.log(res.data);
                axios.put(`http://localhost:8082/api/v1/task/updateRule`, {
                ruleId: ruleDetails.ruleId,
                ruleName: ruleDetails.ruleName,
                projectId: ruleDetails.projectId,
                triggers: triggerData,
                actions: actionData,
                status: "active",
                })
            dispatch(
                openSnackbar({
                    message: "Publish Rule successfully",
                    type: "success",
                })
            );
            navigate(`/rules/${item.projectId}`);

            })
            .catch((err) => {
            console.log(err);
            dispatch(openSnackbar({ open: true, message: "Error Publishing Rule", type: "error" }));
            });
        } else {

            console.log("Existing published workFlow");
            console.log("Existing published  data", publishFlow);
            
            

            const data = {
                publishFlowId: publishFlow.publishFlowId,
                publishFlowName: publishFlow.publishFlowName,
                ruleId: publishFlow.ruleId,
                projectId: publishFlow.projectId,
                triggers: publishFlow.triggers,
                actions: publishFlow.actions,
                status: "active",
            };

            await axios.put(`http://localhost:8082/api/v1/task/updatePublishFlow`, data)
            .then((res) => {
            console.log(res.data);
                axios.put(`http://localhost:8082/api/v1/task/updateRule`, {
                ruleId: ruleDetails.ruleId,
                ruleName: ruleDetails.ruleName,
                projectId: ruleDetails.projectId,
                triggers: ruleDetails.triggers,
                actions: ruleDetails.actions,
                status: "active",
                })
            dispatch(
                openSnackbar({
                    message: "Publish Rule successfully",
                    type: "success",
                })
            );
            navigate(`/rules/${item.projectId}`);

            })
            .catch((err) => {
            console.log(err);
            dispatch(openSnackbar({ open: true, message: "Error Publishing Rule", type: "error" }));
            });
        }
        
    
    }

    const unpublish = async () => {
        console.log(ruleDetails);

        const triggerData = ruleDetails.triggers.map((ele) => ({
            ...ele,
            triggerDetails: { ...ele.triggerDetails },
        }));
        
        const actionData = ruleDetails.actions.map((ele) => ({
            ...ele,
            actionDetails: { ...ele.actionDetails },
        }));
        
        
        await axios.put(`http://localhost:8082/api/v1/task/updatePublishFlow`, {
            publishFlowId: publishFlow.publishFlowId,
            publishFlowName: publishFlow.publishFlowName,
            ruleId: publishFlow.ruleId,
            projectId: publishFlow.projectId,
            triggers: publishFlow.triggers,
            actions: publishFlow.actions,
            status: "inactive",
        })
        .then((res) => {
        console.log(res.data);
            axios.put(`http://localhost:8082/api/v1/task/updateRule`, {
            ruleId: ruleDetails.ruleId,
            ruleName: ruleDetails.ruleName,
            projectId: ruleDetails.projectId,
            triggers: triggerData,
            actions: actionData,
            status: "inactive",
            })
        dispatch(
            openSnackbar({
                message: "Publish Rule successfully",
                type: "success",
            })
        );
        navigate(`/rules/${item.projectId}`);

        })
        .catch((err) => {
        console.log(err);
        dispatch(openSnackbar({ open: true, message: "Error Publishing Rule", type: "error" }));
        });
    }

    const deleteRule = async () => {
        console.log("Delete Rule");

        axios.delete(`http://localhost:8082/api/v1/task/deleteRule/${existingRuleDetails.ruleId}`)
            .then((res) => {
                dispatch(
                    openSnackbar({
                        message: "Rule deleted successfully",
                        type: "success",
                    })
                );
                navigate(`/rules/${item.projectId}`);
            })
            .catch((err) => {
                console.log(err);
                dispatch(openSnackbar({ open: true, message: "Error Deleting Rule", type: "error" }));
            });
    }
    

  const DrawerList = (
    <DrawerContainer style={{ backgroundColor: '#f9f9f9' }}>
      <ArrowIcoBtn onClick={toggleDrawer(false)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '400px' }} role="presentation">
          <top>
            <h1 style={{ margin: '10px 0' }}>Customizer</h1>
          </top>

          <Divider sx={{ padding: '10px 0' }} />



          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', paddingTop: '20px'}}>
            <h3 style={{ margin: '0' }}>This project</h3> 
            <p style={{ margin: '0' }}>View and edit features on this project</p>
          </Box>

          <Button sx={{
                marginTop: '15px',
                borderRadius: '5px',
                border: '1px solid #d74919',
                color: '#d74919',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                width: `100%`,
                padding: '15px 0',
                '&:hover': {
                  backgroundColor: '#d74919',
                  color: 'white'
                }
              }} onClick={toggleDrawer(true)} >
                <DiscountIcon sx={{ fontSize: "15px" }} />
                Fields
            </Button>

            <Button sx={{
                marginTop: '10px',
                borderRadius: '5px',
                border: '1px solid #d09107',
                color: '#d09107',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                width: `100%`,
                padding: '15px 0',
                '&:hover': {
                  backgroundColor: '#d09107',
                  color: 'white'
                }
              }} onClick={() => navigate(`/rules/${item.projectId}`)} >
                <ElectricBoltIcon sx={{ fontSize: "15px" }} />
                Rules
            </Button>

            <Button sx={{
                marginTop: '10px',
                borderRadius: '5px',
                border: '1px solid #9f0992',
                color: '#9f0992',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                width: `100%`,
                padding: '15px 0',
                '&:hover': {
                  backgroundColor: '#9f0992',
                  color: 'white'
                }
              }} onClick={() => setNewForm(true)} >
                <FeedIcon sx={{ fontSize: "15px" }} />
                Forms
            </Button>

            <Button sx={{
                marginTop: '10px',
                borderRadius: '5px',
                border: '1px solid #03840c',
                color: '#03840c',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                width: `100%`,
                padding: '15px 0',
                '&:hover': {
                  backgroundColor: '#03840c',
                  color: 'white'
                }
              }} onClick={() => setNewTaskTemplate(true)} >
                <AddTaskIcon sx={{ fontSize: "15px" }} />
                Task Templates
            </Button>
        
      </Box>
    </DrawerContainer>
  );


  return (
    <Container>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px',height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Header>
            <Title>{item.projectName}</Title>
            <Desc>{item.projectDescription}</Desc>

            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
            <Button sx={{
                    borderRadius: '10px',
                    border: '1px solid rgb(57 204 223)',
                    color: 'rgb(57 204 223)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    gap: '5px',
                    '&:hover': {
                    backgroundColor: 'rgb(57 204 223)',
                    color: 'white'
                    }
                }} onClick={() => window.history.back()} >
                    <ReplyAllIcon sx={{ fontSize: "15px" }} />
                    Back to project Info
                </Button>
                <Button sx={{
                    borderRadius: '10px',
                    border: '1px solid yellowgreen',
                    color: 'yellowgreen',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    gap: '5px',
                    '&:hover': {
                    backgroundColor: 'yellowgreen',
                    color: 'white'
                    }
                }} onClick={toggleDrawer(true)} >
                    <DashboardCustomizeIcon sx={{ fontSize: "15px" }} />
                    Customize
                </Button>
            </div>

            <Hr />
            {inviteMemberPopup && (
              <InviteWorkflowMembers
                inviteMemberPopup={inviteMemberPopup}
                setInviteMemberPopup={setInviteMemberPopup}
                inviteTeamPopup={inviteTeamPopup}
                setInviteTeamPopup={setInviteTeamPopup}
                id={id}
                teamInvite={false}
                data={item}
                workDetails={workDetails}
              />
            )}

            {inviteTeamPopup && (
              <InviteWorkflowMembers
                inviteTeamPopup={inviteTeamPopup}
                setInviteTeamPopup={setInviteTeamPopup}
                inviteMemberPopup={inviteMemberPopup}
                setInviteMemberPopup={setInviteMemberPopup}
                id={id}
                teamInvite={false}
                data={item}
                workDetails={workDetails}
              />
            )}
          </Header>
          <Body>
            <Work>
              <Column alignment={alignment}>
                <ItemWrapper>
                  <Top>
                    <div>
                    <Image src={workflow} />
                    <SubText>
                      Add Rule
                    </SubText>
                    <Text>
                        Automate your team's process and keep work flowing.
                    </Text>
                    </div>
                     <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                     {existingRule ? 
                     <Button sx={{
                        borderRadius: '10px',
                        border: '1px solid red',
                        color: 'red',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        gap: '5px',
                        '&:hover': {
                        backgroundColor: 'red',
                        color: 'white'
                        }
                    }} onClick={deleteRule} >
                        <PublishIcon sx={{ fontSize: "15px" }} />
                        Delete Rule
                    </Button>
                    : null}

                    {existingRule && existingRuleDetails?.status === "inactive" ? <Button sx={{
                        borderRadius: '10px',
                        border: '1px solid darkorange',
                        color: 'darkorange',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        gap: '5px',
                        '&:hover': {
                        backgroundColor: 'darkorange',
                        color: 'white'
                        }
                    }} onClick={publish} >
                        <PublishIcon sx={{ fontSize: "15px" }} />
                        Publish Rule
                    </Button> :
                    existingRuleDetails?.status === "active" ?

                    <Button sx={{
                        borderRadius: '10px',
                        border: '1px solid darkorange',
                        color: 'darkorange',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        gap: '5px',
                        '&:hover': {
                        backgroundColor: 'darkorange',
                        color: 'white'
                        }
                    }} onClick={unpublish} >
                        <PublishIcon sx={{ fontSize: "15px" }} />
                        Unpublish Rule
                    </Button>
                     : 
                    <Button sx={{
                        borderRadius: '10px',
                        border: '1px solid darkorange',
                        color: 'darkorange',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        gap: '5px',
                        '&:hover': {
                        backgroundColor: 'darkorange',
                        color: 'white'
                        }
                    }} onClick={createRule} >
                        <PublishIcon sx={{ fontSize: "15px" }} />
                        Create Rule
                    </Button>}
                     </div>

                    
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1 }}>
                    <Masonry gutter="10px">
                         {/* Trigger cards */}
                         {triggers?.map((ele) => (
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "0px", 
                                textAlign: "center", 
                                display: "block",
                                margin: "auto",
                                borderRadius: "10px",
                                border: ele.status === "active" ? "1px solid #fff" : "1px dashed #fff",
                                backgroundColor: ele.status === "active" ? "azure" : `${({ theme }) => theme.card}`
                                }}
                            >
                                <Button onClick={() => { setTriggerHandle(true); setActionHandle(false); triggerEventHandle(ele) }} style={{ 
                                    border: "none",
                                    backgroundColor: "transparent",
                                    }}
                                    >
                                    <TriggerRuleCard trigger={ele}  />
                                </Button>

                                {!existingRule && <Button onClick={() => deleteTrigger(ele.id, ele.status)}>
                                    <CancelIcon style={{ color: "red" }} />
                                    </Button>}
                                
                            </div>               
                        ))}
                        {/* Add New Trigger Button */}
                        {/* {!existingRule ? 
                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <IcoBtn style={{ border: "1px solid orange" }} onClick={addTrigger}>
                            <ControlPointIcon />
                        </IcoBtn>
                        </div> : null} */}

                        {/* Arrow Between Triggers and Actions */}
                        {triggers.length !== 0 && actions.length !== 0 && (
                        <div style={{ width: "100%", textAlign: "center", margin: "20px 0" }}>
                            <HiArrowDown size={40} color="#999" />
                        </div>
                        )}

                        {/* Action cards */}
                        {actions.map((ele) => (
                            <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "0px", 
                                textAlign: "center", 
                                display: "block",
                                margin: "auto",
                                border: ele.status === "active" ? "1px solid #fff" : "1px dashed #fff",
                                backgroundColor: ele.status === "active" ? "azure" : `${({ theme }) => theme.card}`
                                }}
                            >
                                <Button onClick={() => { setTriggerHandle(false); setActionHandle(true); actionEventHandle(ele) }} style={{ 
                                    border: "none",
                                    backgroundColor: "transparent",
                                    }}
                                    >
                                    <ActionRuleCard action={ele} />
                                </Button>
                                    {!existingRule && <Button onClick={() => deleteAction(ele.id, ele.status)}>
                                    <CancelIcon style={{ color: "red" }} />
                                </Button>}
                                
                                
                            </div>               
                        ))}

                        {/* Add New Trigger Button */}
                        {!existingRule ?
                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <IcoBtn style={{ border: "1px solid orange" }} onClick={addAction}>
                            <ControlPointIcon />
                        </IcoBtn>
                        </div> : null}

                    </Masonry>
                    </ResponsiveMasonry>

                </ItemWrapper>
              </Column>
            </Work>
            <HrHor />
            <Extra>
                {triggerHandle && <TriggerFunctionCards works={works} taskTemplates={taskTemplates} existingRule={existingRule} setIsActiveTrigger={setIsActiveTrigger} setIsActiveAction={setIsActiveAction} projectId={id} activeTrigger={activeTrigger} setActiveTrigger={setActiveTrigger} />}
                {actionHandle && <ActionFunctionCards works={works} existingRule={existingRule} setIsActiveAction={setIsActiveAction} setIsActiveTrigger={setIsActiveTrigger} projectId={id} activeAction={activeAction} setActiveAction={setActiveAction} />}
            </Extra>
          </Body>
        </>
      )}

       <Drawer 
        anchor="right" 
        open={open} onClose={toggleDrawer(false)} 
        TransitionComponent={Slide}
        transitionDuration={1000}
        >
          {DrawerList}
        </Drawer>

        {newForm && <AddForm setNewForm={setNewForm} />}
        {newTaskTemplate && <AddTaskTemplate setNewTaskTemplate={setNewTaskTemplate} projectId={item.projectId} setTaskTemplateAdded={setTaskTemplateAdded} />}
    
    </Container>
  );
};

export default Rule;
