import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import {
  CheckCircleOutlineOutlined,
  DonutLarge,
} from "@mui/icons-material";
import WorkCards from "../components/WorkCards";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import WorkDetails from "../pages/WorkDetailsPage";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import TaskCard from "../components/TaskCard";
import TaskDetailCard from "../components/TaskDetailCard";

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

const Selector = styled.select`
  color: ${({ theme }) => theme.white};
`;


const Span = styled.span`
  color: ${({ theme }) => theme.soft2};
  font-weight: 400;
  margin-left: 8px;
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

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [currentWork, setCurrentWork] = useState({});
  const [selectedUserId, setSelectedUserId] = useState("ALL");
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [openWork, setOpenWork] = useState(false);
  const [alignment, setAlignment] = useState(true);

  const getTasks = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getAllTasks`)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const openWorkDetails = (work) => {
    setCurrentWork(work);
    setOpenWork(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getTasks();
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

  console.log("tasks", tasks);
  


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
              <option value="ALL">All Tasks</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName}
                </option>
              ))}
            </Selector>
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
                          tasks
                          .filter((item) => item.status === false)
                            .length
                        }{" "}
                        )
                      </Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1 }}>
                    <Masonry gutter="14px">
                      {tasks
                      ?.filter(selectedUserId === "ALL" ? (item) => item.status === false : (item) => item.collaboratorIds?.includes(parseInt(selectedUserId)))
                        .filter((item) => item.status == false)
                        .map((item) => (
                            <TaskDetailCard item={item} />
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
                          tasks.filter((item) => item.status == true)
                            .length
                        }{" "}
                        )
                      </Span>
                    </Text>
                  </Top>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1 }}>
                    <Masonry gutter="14px">
                      {tasks
                      ?.filter(selectedUserId === "ALL" ? (item) => item.status === true : (item) => item.collaboratorIds?.includes(parseInt(selectedUserId)))
                        .filter((item) => item.status == true)
                        .map((item) => (
                            <TaskDetailCard item={item} />
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

export default Tasks;
