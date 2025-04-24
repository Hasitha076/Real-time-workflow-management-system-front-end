import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Item from "../components/Card";
import { statuses, tagColors } from "../data/data";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { useQuery } from '@apollo/client'
import { LOAD_ALL_PROJECTS } from '../GraphQL/Queries'
import { data } from "react-router-dom";
import axios from "axios";
import { openSnackbar } from "../redux/snackbarSlice";

const Container = styled.div`
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
  justify-content: space-between;
  margin: 12px 0px;
`;
const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  @media screen and (max-width: 480px) {
    width: 97%;
  }
  padding: 4px;
  text-align: left;
  margin: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Span = styled.span`
  color: ${({ theme }) => theme.soft2};
  font-weight: 400;
  margin-left: 8px;
`;

const Wrapper = styled.div`
  padding: 12px 6px;
`;

const OutlinedBox = styled.div`
  min-height: 44px;
  border-radius: 8px;
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
    background: ${theme.card}; `}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
    margin-top: 8px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
  &:hover {
    transition: all 0.6s ease-in-out;
    background: ${({ theme }) => theme.soft};
    color: white;
  }
`;

const Selector = styled.select`
  color: ${({ theme }) => theme.white};
`;

const Projects = ({newProject,setNewProject, projectCreated, setProjectCreated}) => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedUserId, setSelectedUserId] = useState("ALL");
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);

  const { loading: Loading, error, data: allProjects, refetch } = useQuery(LOAD_ALL_PROJECTS);

  const getprojects = async () => {
    if (!allProjects || !allProjects.getAllProjects) return;
    setProjects(allProjects.getAllProjects);
    setLoading(false);
  };

  useEffect(() => {
    getprojects();
    window.scrollTo(0, 0);
    
    if (projectCreated) {
      refetch().then(() => {
        getprojects();
        setProjectCreated(false);
      });
    }
  }, [newProject, currentUser, projectCreated, Loading, data]);

  useEffect(() => {
      refetch()
      getprojects();
      getAvailableMember();
  }, []);

  const getAvailableMember = async () => {

    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/getAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":   "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
  
      setUsers(response.data);
      // loading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  return (
    <Container>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (

        <>
          <OutlinedBox style={{ width: "220px", marginBottom: "12px" }}>
            <Selector
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "16px",
              }}
            >
              <option value="ALL">All Projects</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName}
                </option>
              ))}
            </Selector>
          </OutlinedBox>
        
        <Column>
          {statuses.map((s, index) => (
            <ItemWrapper key={index}>
              {s.icon} {s.title}
              <Span>({projects?.filter((item) => item.status === s.status).length})</Span>
              <Wrapper>
                {s.status === "PENDING" && (

                  <OutlinedBox button onClick={() => currentUser.role === "ADMIN" ? setNewProject(true) : currentUser.role === "MANAGER" ? setNewProject(true) : dispatch(openSnackbar({ message: "You don't have permission to create a project", severity: "error" }))} style={{ marginBottom: "12px" }}>
                    New Project
                  </OutlinedBox>
                )}
                {projects
                  ?.filter(selectedUserId === "ALL" ? (item) => item.status === s.status : (item => item.collaboratorIds?.includes(parseInt(selectedUserId))))
                  ?.filter((item) => item.status === s.status)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((item, idx) => (
                    <Item key={item.projectId} item={item} index={idx} status={item.status} tagColor={tagColors[3]} />
                  ))}
              </Wrapper>
            </ItemWrapper>
          ))}
        </Column>
        </>
      )}
    </Container>
  );
};

export default Projects;
