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
import InviteMembers from "../components/InviteMembers";
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
import WorkFlowCards from "../components/WorkFlowCards";
import WorkFlowMainCard from "../components/WorkFlowMainCard";
import AddForm from "../components/AddForm";
import InviteWorkflowMembers from "../components/InviteWorkflowMembers";
import AddTaskTemplate from "../components/AddTaskTemplate";

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
  flex-direction: column;
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


const Workflow = () => {
  const { id } = useParams();
  const [item, setItems] = useState([]);
  const [projectCollaborators, setProjectCollaborators] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [loading, setLoading] = useState(true);
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
  
  //use state enum to check for which updation
  const [openUpdate, setOpenUpdate] = useState({ state: false, type: "all", data: item });

  //use state for delete popup
  const [openDelete, setOpenDelete] = useState({ state: false, type: "Project", data: item });

  const dispatch = useDispatch();
  
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    const navigate = useNavigate();

  const getproject = async (id) => {
    await axios.get(`http://localhost:8083/api/v1/project/getProject/${id}`)
      .then((res) => {
        setItems(res.data);
        setProjectCollaborators(res.data.collaboratorIds);
        setProjectTeams(res.data.teamIds);
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
  

  console.log(id);
  console.log(collaborators);
  console.log(teams);
  console.log(works);
  console.log(projectCollaborators);
  console.log(projectTeams);
  

  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getproject(id); 
    // getProjectWorks(id);
  }, [openWork, openUpdate, inviteMemberPopup, id]);


  const DrawerList = (
    <DrawerContainer>
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

            <Hr />
            {inviteMemberPopup && (
              <InviteWorkflowMembers
              inviteMemberPopup={inviteMemberPopup}
                setInviteMemberPopup={setInviteMemberPopup}
                id={id}
                teamInvite={false}
                setLoading={setLoading}
                data={item}
              />
            )}

            {inviteTeamPopup && (
              <InviteWorkflowMembers
                inviteTeamPopup={inviteTeamPopup}
                setInviteTeamPopup={setInviteTeamPopup}
                id={id}
                teamInvite={false}
                setLoading={setLoading}
                data={item}
              />
            )}
          </Header>
          <Body>
            <Work>
              <Column alignment={alignment}>
                <ItemWrapper>
                  <Top>
                    <Image src={workflow} />
                    <SubText>
                      Start building your workflow in two minutes
                    </SubText>
                    <Text>
                        Automate your team's process and keep work flowing.
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">

                    {works.length != 0 && works.map((work) => (
                        <div>
                          <WorkFlowCards
                            work={work}
                            projectId={id}
                            ProjectMembers={projectCollaborators}
                            ProjectTeams={projectTeams}
                            setInviteMemberPopup={setInviteMemberPopup}
                            setInviteTeamPopup={setInviteTeamPopup}
                          />
                        </div>
                      ))}
                  </Masonry>
                  </ResponsiveMasonry >
                </ItemWrapper>
              </Column>
            </Work>
            <HrHor />
            <Extra>
                <WorkFlowMainCard projectId={id} newForm={newForm} setNewForm={setNewForm} setNewTaskTemplate={setNewTaskTemplate}/>
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
        {newTaskTemplate && <AddTaskTemplate setNewTaskTemplate={setNewTaskTemplate} />}
    </Container>
  );
};

export default Workflow;
