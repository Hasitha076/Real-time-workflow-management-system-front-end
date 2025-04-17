import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlineOutlined,
  DonutLarge,
} from "@mui/icons-material";
import WorkCards from "../components/WorkCards";
import { CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { openSnackbar } from "../redux/snackbarSlice";
import WorkDetails from "../pages/WorkDetailsPage";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const Container = styled.div`
  padding: 14px 14px;
  display: flex;
  justify-content: center;
  flex: 1;
  gap: 20px;
  @media screen and (max-width: 480px) {
    padding: 10px 10px;
  }
`;

const Header = styled.div``;

const Column = styled.div`
  display: flex;
  ${(props) =>
    props.alignment ? "flex-direction: column;" : "flex-direction: row;"}
  margin: 12px 0px;
  flex-wrap: wrap;
  align-items: stretch;
  @media screen and (max-width: 480px) {
    margin: 6px 0px;
    flex-direction: column;
  }
`;

const Work = styled.div`
  flex: 1.2;
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

//tasks

const No = styled.div`
  width: 4%;
  font-size: 12px;
  text-overflow: ellipsis;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;

  ${({ completed, theme }) =>
    completed === "Completed" &&
    `
    text-decoration: line-through;
    `}
`;

const Task = styled.div`
  width: 50%;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  padding: 6px;

  ${({ completed, theme }) =>
    completed === "Completed" &&
    `
    text-decoration: line-through;
    `}
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

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [invitePopup, setInvitePopup] = useState(false);
  const [works, setWorks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [created, setCreated] = useState(false);
  const [currentWork, setCurrentWork] = useState({});
  const [selectedUserId, setSelectedUserId] = useState("ALL");
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [openWork, setOpenWork] = useState(false);
  const [alignment, setAlignment] = useState(true);

  const getAllWorks = async () => {
    await axios.get(`http://localhost:8086/api/v1/work/getAllWorks`)
      .then((res) => {
        setWorks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllWorks();
    getAvailableMember();
  }, []);

  console.log(selectedUserId);
  console.log(works);
  
  

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
      loading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  return (
    <Container>
      {openWork && <WorkDetails setOpenWork={setOpenWork} work={currentWork} />}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px', height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
    
            <Container>
            <Work>  
            <OutlinedBox style={{ width: "220px", marginBottom: "12px" }}>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: "100%",
                background: "transparent",
                color: "#fff",
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
            </select>
          </OutlinedBox>
              <Column alignment={alignment}>
                <ItemWrapper>
                  <Top>
                    <Text>
                      <DonutLarge sx={{ color: "#1976D2", fontSize: "20px" }} />
                      In Progress
                      <Span>
                        ({" "}
                        {
                          works
                          .filter((item) => item.status === false)
                            .length
                        }{" "}
                        )
                      </Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1 }}>
                    <Masonry gutter="14px">
                      {works
                      ?.filter(selectedUserId === "ALL" ? (item) => item.status === false : (item) => item.collaboratorIds?.includes(parseInt(selectedUserId)))
                        .filter((item) => item.status == false)
                        .map((item) => (
                          <div onClick={() => openWorkDetails(item)}>
                            <WorkCards status="In Progress" work={item} />
                          </div>
                        ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </ItemWrapper>
              </Column>
            </Work>


            <Work>
            
              <Column alignment={alignment}>
                <ItemWrapper>
                  <Top>
                    <Text>
                      <CheckCircleOutlineOutlined
                        sx={{ color: "#67BC6D", fontSize: "20px" }}
                      />
                      Completed
                      <Span>
                        ({" "}
                        {
                          works.filter((item) => item.status == true)
                            .length
                        }{" "}
                        )
                      </Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1 }}>
                    <Masonry gutter="14px">
                      {works
                      ?.filter(selectedUserId === "ALL" ? (item) => item.status === true : (item) => item.collaboratorIds?.includes(parseInt(selectedUserId)))
                        .filter((item) => item.status == true)
                        .map((item) => (
                          <div onClick={() => openWorkDetails(item)}>
                            <WorkCards status="In Progress" work={item} />
                          </div>
                        ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </ItemWrapper>
              </Column>
            </Work>
          
            </Container>
        </>
      )}
    </Container>
  );
};

export default ProjectDetails;
