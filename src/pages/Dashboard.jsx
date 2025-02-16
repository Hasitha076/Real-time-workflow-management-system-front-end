
import React from "react";
import { useState, useEffect } from "react";
import Styled, { useTheme } from "styled-components";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LinearProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import axios from "axios";
import ProjectCard from "../components/Card";
import WorkCards from "../components/WorkCards";
import { statuses, data, tagColors } from "../data/data";
import { LOAD_ALL_PROJECTS } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

const Container = Styled.div`
  overflow-y: visible !important;
@media screen and (max-width: 480px) {
  padding: 10px 10px;
}
`;

const Section = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

`;

const Left = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
  overflow-y: visible !important;
`;

const Right = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;

const TopBar = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 16px;
  margin: 20px 0px;
`;

const StatsWrapper = Styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  grid-gap: 15px;
  margin: 20px 0px;
`;

const StatCard = Styled.div`
  height: 100%;
  padding: 4px;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.20);
  transition: all 0.5s ease;
  &:hover {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  }
`;

const RecentProjects = Styled.div`
  width: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
`;

const RecentWorks = Styled.div`
  width: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
`;

const SectionTitle = Styled.div` 
  width: 100%;
  padding: 0px 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0px 16px 0px;
  color: ${({ theme }) => theme.text};
`;

const TotalProjects = Styled.div` 
  width: 100%;
  padding: 8px 12px;
`;

const TaskCompleted = Styled.div` 
  width: 100%;
  padding: 8px 12px;
`;

const Progress = Styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 0px 0 0;
`;

const ProgressText = Styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Desc = Styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 0px 4px;
  line-spacing: 1.5;
  font-size: 13px;
  color: ${({ theme }) => theme.soft2};
`;

const TotalWorks = Styled.div`
  width: 100%;
  padding: 8px 12px;
`;

const Title = Styled.div`
  width: 100%;
  height: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Span = Styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;


const Dashboard = () => {

  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [works, setWorks] = useState([]);
  const [totalProjectsDone, setTotalProjectsDone] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalWorks, setTotalWorks] = useState(0);
  const [totalTasksDone, setTotalTasksDone] = useState(0);
  const [totalWorksDone, setTotalWorksDone] = useState(0);

  const { loading, error, data } = useQuery(LOAD_ALL_PROJECTS);
  
  const getprojects = async () => {

    if (!data || !data.getAllProjects) return; // Ensure data exists before using it
    setProjects(data.getAllProjects);
    setTotalProjectsDone(
      data.getAllProjects.filter((project) => project.status === "COMPLETED").length
    );
    setTotalProjects(data.getAllProjects.length);

  };
  

  const getTasks = async () => {

    await axios.get("http://localhost:8082/api/v1/task/getAllTasks")
      .then((res) => {
        setTasks(res.data);
        

        setTotalTasks(res.data.length);
        setTotalTasksDone(res.data.filter((task) => task.status === true).length);
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

  const getAllWorks = async () => {
    await axios.get(`http://localhost:8086/api/v1/work/getAllWorks`)
      .then((res) => {
        setWorks(res.data);
        

        setTotalWorks(res.data.length);
        setTotalWorksDone(res.data.filter((work) => work.status === true).length);
      })
      .catch((err) => {
        console.log(err);
        
      });
  }
  
  useEffect(() => {
    getprojects();
    getTasks();
    getAllWorks();

    window.scrollTo(0, 0);
  }, [loading]);


  return (
    <Container>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px', height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <Section>
          <Left>
            <StatsWrapper>
              <StatCard>
                <TotalProjects>
                  <Title>Total Projects Done</Title>
                  <Progress>
                    <LinearProgress
                      sx={{
                        borderRadius: "10px", height: 7, width: "80%"
                      }}
                      variant="determinate"
                      value={
                        totalProjectsDone === 0
                          ? 0
                          : (totalProjectsDone / totalProjects) * 100
                      }
                    />
                    <ProgressText>{totalProjectsDone.toString()}</ProgressText>
                  </Progress>
                  <Desc>Working on&nbsp;
                    <Span> {(totalProjects - totalProjectsDone).toString()} </Span>
                    &nbsp;projects</Desc>
                </TotalProjects>
              </StatCard>

              <StatCard>
                <TotalWorks>
                  <Title>Total Works Done</Title>
                  <Progress>
                    <LinearProgress
                      sx={{ borderRadius: "10px", height: 7, width: "80%" }}
                      variant="determinate"
                      value={
                        totalWorksDone === 0
                          ? 0
                          : (totalWorksDone / totalWorks) * 100
                      }
                      color={"success"}
                    />
                    <ProgressText>{totalWorksDone}</ProgressText>
                  </Progress>
                  <Desc><Span>{totalWorks - totalWorksDone}</Span> &nbsp;Works are left</Desc>
                </TotalWorks>
              </StatCard>

              <StatCard>
                <TaskCompleted>
                  <Title>Total Task Done</Title>
                  <Progress>
                    <LinearProgress
                      sx={{ borderRadius: "10px", height: 7, width: "80%" }}
                      variant="determinate"
                      value={
                        totalTasksDone === 0
                          ? 0
                          : (totalTasksDone / totalTasks) * 100
                      }
                      color={"success"}
                    />
                    <ProgressText>{totalTasksDone}</ProgressText>
                  </Progress>
                  <Desc><Span>{totalTasks - totalTasksDone}</Span> &nbsp;Tasks are left</Desc>
                </TaskCompleted>
              </StatCard>

            </StatsWrapper>

            <Box >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <RecentProjects>
                  <SectionTitle>Recent Projects</SectionTitle>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="0px 16px">
                    {
                    [...(projects || [])] // Clone the array to avoid mutating the original
                        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) // Sort based on updatedAt
                        .slice(0, 4) // Get only the first 4 items
                        .map((project, id) => (
                        <ProjectCard
                            key={id}
                            item={project}
                            index={id}
                            status={project.status}
                            tagColor={tagColors[3]}
                        />
                        ))
                    }
                    </Masonry>
                  </ResponsiveMasonry>
                </RecentProjects>

                <RecentWorks>
                  <SectionTitle>Recent Works</SectionTitle>
                  <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
                    <Masonry gutter="10px 16px">
                      {
                        works
                          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                          .filter((item, index) => index < 6)
                          .slice(0, 4)
                          .map((work, id) => (
                            <WorkCards
                              key={id}
                              work={work}
                              index={id}
                              status={work.status}
                              tagColor={tagColors[3]}
                            />
                          ))
                      }
                    </Masonry>
                  </ResponsiveMasonry>
                </RecentWorks>
              </Box>


            </Box>

          </Left>
          
        </Section>
      )}
    </Container >
  );
};

export default Dashboard;
