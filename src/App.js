
import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from "./utils/Theme";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import Works from './pages/Works';
import Projects from './pages/Projects';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ToastMessage from './components/ToastMessage';
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import ProjectDetails from "./pages/ProjectDetails";
import WorkDetailsPage from "./pages/WorkDetailsPage";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import AddNewProject from "./components/AddNewProject";
import AddNewTeam from "./components/AddNewTeam";
import Workflow from "./pages/Workflow";
import Home from "./pages/Home/Home";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import AddNewUser from "./components/AddNewUser";
import Rule from "./pages/Rule";
import RulesPage from "./pages/RulesPage";
import Tasks from "./pages/Tasks";


const Container = styled.div`
height: 100vh;
  display: flex; 
  background-color: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.text};
  overflow-x: hidden;
`;

const Main = styled.div`
  flex: 7;
`;
const Wrapper = styled.div`
  padding: 0% 1%;
  /* overflow-y: scroll !important; */
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [newTeam, setNewTeam] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [newProject, setNewProject] = useState(false);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [loading, setLoading] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [updateWorkFromTask, setUpdateWorkFromTask] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const token = localStorage.getItem("token");


  //set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>

        <BrowserRouter>
          {currentUser != null || token ?
            <Container >
              {loading ? <div>Loading...</div> : <>
                {menuOpen && <Menu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} setNewTeam={setNewTeam} />}
                <Main>
                  <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} token={token} setDarkMode={setDarkMode} darkMode={darkMode} />
                  <Wrapper>
                    {newTeam && <AddNewTeam setNewTeam={setNewTeam} />}
                    {newProject && <AddNewProject setNewProject={setNewProject} setProjectCreated={setProjectCreated} />}
                    {newUser && <AddNewUser setNewUser={setNewUser} setUserCreated={setUserCreated} />}
                    
                    <Routes>
                      <Route >
                    
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="projects" element={<Projects newProject={newProject} setNewProject={setNewProject} projectCreated={projectCreated} setProjectCreated={setProjectCreated} />} />
                        
                        <Route path="projects">
                          <Route path=":id" element={<ProjectDetails updateWorkFromTask={updateWorkFromTask} setUpdateWorkFromTask={setUpdateWorkFromTask} />} />
                        </Route>
    
                        <Route path="works" element={<Works />} />
                        <Route path="works">
                          <Route path=":id" element={<WorkDetailsPage setUpdateWorkFromTask={setUpdateWorkFromTask} />} />
                        </Route>
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="teams" element={<Teams />} />
                        <Route path="teams">
                          <Route path=":id" element={<TeamDetails />} />
                        </Route>
                        <Route path="workflow" element={<Workflow />} />
                        <Route path="workflow">
                          <Route path=":id" element={<Workflow />} />
                        </Route>
                        <Route path="rules" element={<RulesPage />} />
                        <Route path="rules">
                          <Route path=":id" element={<RulesPage />} />
                        </Route>
                        <Route path="rule">
                          <Route path=":id" element={<Rule />} />
                        </Route>
                        <Route path="members" element={<Members setNewUser={setNewUser} userCreated={userCreated} setUserCreated={setUserCreated} />} />
                        <Route path="members">
                          <Route path=":id" element={<MemberDetails currentUser={currentUser} />} />
                        </Route>
                        <Route path="*" element={<div>Not Found</div>} />
                      </Route>
                    </Routes>
                  </Wrapper>
                </Main>
              </>}
            </Container>
            : <ThemeProvider theme={darkTheme}
            >

              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </ThemeProvider>}
          {open && <ToastMessage open={open} message={message} severity={severity} />}

        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
