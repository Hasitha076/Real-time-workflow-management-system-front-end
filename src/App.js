
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
import Projects from './pages/Projects';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ToastMessage from './components/ToastMessage';
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Container = styled.div`
height: 100vh;
  display: flex; 
  background-color: ${({ theme }) => theme.bg};
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
  const [newProject, setNewProject] = useState(false);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [loading, setLoading] = useState(false);


  const { currentUser } = useSelector(state => state.user);


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
          {currentUser ?
            <Container >
              {loading ? <div>Loading...</div> : <>
                {menuOpen && <Menu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} setNewTeam={setNewTeam} />}
                <Main>
                  <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                  <Wrapper>
                    {/* {newTeam && <AddNewTeam setNewTeam={setNewTeam} />}
                    {newProject && <AddNewProject setNewProject={setNewProject} />} */}
                    <Routes>
                      <Route >
                        <Route exact path="/" element={<Dashboard setNewTeam={setNewTeam} setNewProject={setNewProject}/>} />
                        <Route path="projects" element={<Projects newProject={newProject} setNewProject={setNewProject}/>} />
                        
                        
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
                
              </Routes>
            </ThemeProvider>}
          {open && <ToastMessage open={open} message={message} severity={severity} />}

        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
