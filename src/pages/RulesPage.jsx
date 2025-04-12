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
import WorkFlowCards from "../components/WorkFlowCards";
import RuleTemplateCard from "../components/RuleTemplateCard";


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

const CustomRuleCard = styled.div`
  padding: 14px;
  height: 100%;
  text-align: center;
  display: flex;
justify-content: center;
align-items: center;
  margin: 2px 0px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.soft2};
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


const RulesPage = () => {
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
  
  useEffect(() => {
    getCollaborators();
    getTeams();
    getWorks();
  }, [item, id]);
  

  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openWork, openUpdate, inviteMemberPopup, id]);

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
              }} onClick={toggleDrawer(true)} >
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

                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 3, 900: 4 }}>
                    <Masonry gutter="10px">

                    <CustomRuleCard onClick={() => navigate(`/rule/${item.projectId}`)}>
                        Create a Custom Rule
                    </CustomRuleCard>

                    {works.length != 0 && works.map((work) => (
                        <div>
                          <RuleTemplateCard
                            work={work}
                            projectId={id}
                            ProjectMembers={projectCollaborators}
                            ProjectTeams={projectTeams}
                            setInviteMemberPopup={setInviteMemberPopup}
                            setInviteTeamPopup={setInviteTeamPopup}
                            setWorkDetails={setWorkDetails}
                          />
                        </div>
                      ))}

                    </Masonry>
                    </ResponsiveMasonry>

                </ItemWrapper>
              </Column>
            </Work>
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

export default RulesPage;
