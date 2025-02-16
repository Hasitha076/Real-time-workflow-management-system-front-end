import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlineOutlined,
  Delete,
  DonutLarge,
  Edit,
  PersonAdd,
} from "@mui/icons-material";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { Button } from "@mui/material";
import { tagColors } from "../data/data";
import WorkCards from "../components/WorkCards";
import MemberCard from "../components/MemberCard";
import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import InviteMembers from "../components/InviteMembers";
import AddWork from "../components/AddWork";
import WorkDetails from "../pages/WorkDetailsPage";
import UpdateProject from "../components/UpdateProject";
import DeletePopup from "../components/DeletePopup";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DiscountIcon from '@mui/icons-material/Discount';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FeedIcon from '@mui/icons-material/Feed';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from '@mui/material/Box';
import {Drawer, Slide} from '@mui/material';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";
import AddTaskTemplate from "../components/AddTaskTemplate";
import AddForm from "../components/AddForm";
import { LOAD_PROJECT_BY_ID } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

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

const Customizer = styled.button`

`;

const HrHor = styled.div`
  border: 0.5px solid ${({ theme }) => theme.soft + "99"};
`;

const IcoBtn = styled(IconButton)`
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.white} !important;
  &:hover {
    background-color: ${({ theme }) => theme.white} !important;
    color: ${({ theme }) => theme.black} !important;
  }
`;

const ArrowIcoBtn = styled(IconButton)`
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

const DrawerContainer = styled.div`
  padding: 30px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
`;


const ProjectDetails = () => {
  const { id } = useParams();
  const [item, setItems] = useState(null);
  const [projectCollaborators, setProjectCollaborators] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [invitePopup, setInvitePopup] = useState(false);
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
  const [workAdded, setWorkAdded] = useState(false);
  const [workUpdated, setWorkUpdated] = useState(false);

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

    useEffect(() => {
      if (workAdded) {
        getWorks();
        setWorkAdded(false);
      }
    }, [workAdded]);

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const openDropdown = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


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
  }, [item, id, created, workUpdated]);
  

  console.log(item);
  

  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // getProjectWorks(id);
  }, [openWork, openUpdate, invitePopup, id, loading]);


  const DrawerList = (
    <DrawerContainer>
      <ArrowIcoBtn onClick={toggleDrawer(false)}>
        <KeyboardDoubleArrowRightIcon/>
      </ArrowIcoBtn>
      <Box sx={{ width: '300px' }} role="presentation">
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
      {openWork && <WorkDetails setOpenWork={setOpenWork} work={currentWork} />}
      {openUpdate.state && <UpdateProject openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} type={openUpdate.type} />}
      {openDelete.state && <DeletePopup openDelete={openDelete} setOpenDelete={setOpenDelete} />}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px',height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Header>
            <Title>{item?.projectName}</Title>
            <Desc>{item?.projectDescription}</Desc>
            <Tags>
              {item?.tags.map((tag) => (
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
              {item?.memberIcons.length > 0 ? <AvatarGroup>
                {item?.memberIcons.map((member) => (
                  <Avatar
                    sx={{ marginRight: "-12px", width: "38px", height: "38px" }}
                  >
                    {member.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>  : <Avatar sx={{ backgroundColor: 'transparent', border: '1px dashed #fff' }}><AccountCircleIcon/></Avatar>}
              <InviteButton onClick={() => setInvitePopup(true)}>
                <PersonAdd sx={{ fontSize: "12px" }} />
                Invite
              </InviteButton>
            </Members>
            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
            <Button sx={{
                borderRadius: '10px',
                border: '1px solid #e68911',
                color: '#e68911',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                gap: '5px',
                '&:hover': {
                  backgroundColor: '#e68911',
                  color: 'white'
                }
              }} onClick={() => navigate(`/workflow/${item.projectId}`)} >
                <AccountTreeIcon sx={{ fontSize: "15px" }} />
                Workflow
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
              <IcoBtn style={{ border: '1px solid orange' }} onClick={() => setOpenUpdate({ state: true, type: 'all', data: item })}>
                <Edit sx={{ fontSize: "20px" }} />
              </IcoBtn>
              <IcoBtn style={{ border: '1px solid red' }} onClick={() => setOpenDelete({ state: true, type: 'Project', name: item?.projectName, id: item.projectId })}>
                <Delete sx={{ fontSize: "20px" }} />
              </IcoBtn>
              
            </div>

            <Hr />
            {invitePopup && (
              <InviteMembers
                setInvitePopup={setInvitePopup}
                id={id}
                teamInvite={false}
                data={item}
              />
            )}
          </Header>
          <Body>
            <Work>
              
              <Column alignment={alignment}>
              
                <ItemWrapper>
                  
                  <Top>
                    <Text>
                      <DonutLarge sx={{ color: "#1976D2", fontSize: "20px" }} />
                      In Progress
                      <Span>(
                        {
                          works.length != 0 && works.filter(
                            (item) => item.status === false
                          ).length
                        }
                        )</Span>
                    </Text>
                    
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">
                    <AddWork
                      ProjectMembers={projectCollaborators}
                      ProjectTeams={projectTeams}
                      ProjectId={id}
                      memberIcons={item?.memberIcons}
                      setCreated={setCreated}
                      data={item}
                      setWorkAdded={setWorkAdded}
                    />

                    {works.length != 0 && works.filter((item) => item.status === false)
                      .map((filteredItem) => (
                        <div onClick={() => openWorkDetails(filteredItem)}>
                          <WorkCards
                            status="In Progress"
                            work={filteredItem}
                            projectId={id}
                            ProjectMembers={projectCollaborators}
                            ProjectTeams={projectTeams}
                            setWorkUpdated={setWorkUpdated}
                          />
                        </div>
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
                          works.length != 0 && works
                            .filter(
                              (item) => item.status === true
                            ).length
                        }
                        )</Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="14px">
                    {works.length != 0 && works.filter((item) => item.status === true)
                      .map((item) => (
                        <div onClick={() => openWorkDetails(item)}>
                          <WorkCards
                            status="Completed"
                            work={item}
                          />
                        </div>
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
                </SubCardTop>
                {item?.collaboratorIds.map((id) => (
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
                </SubCardTop>
                {item?.teamIds.map((id) => (
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

       <Drawer 
        anchor="right" 
        open={open} onClose={toggleDrawer(false)}
        // onClick={toggleDrawer(false)}
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

export default ProjectDetails;
