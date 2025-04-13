import { IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {
    CloseRounded
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import axios from "axios";



const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: min-content;
  margin: 2%;
  max-width: 600px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 15px 25px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px 0;
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 12px 0 0px 0;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
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
    background: ${theme.soft};
    color:'${theme.soft2}';`}
    ${({ activeButton, theme }) =>
        activeButton &&
        `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 0;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 12px 0;
  align-items: center;
  justify-content: space-between;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const FlexDisplay = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;

const UpdateTask = ({ openUpdate, setOpenUpdate, setEditTask, setUpdateWorkFromTask }) => {
    console.log(openUpdate.data);
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [backDisabled, setBackDisabled] = useState(false);
    const [showAddProject, setShowAddProject] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [works, setWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);

    const goToAddProject = () => {
        setShowAddProject(true);
        setShowAddMember(false);
    };

    const goToAddMember = () => {
        setShowAddProject(false);
        setShowAddMember(true);
    };

    useEffect(() => {

        if (openUpdate.type === "all") {
            goToAddProject();
        } else if (openUpdate.type === "member") {
            goToAddMember();
        }

    }, [openUpdate]);

    const getWorks = async () => {
        await axios.get(`http://localhost:8086/api/v1/work/getWorksByProjectId/${openUpdate.data.projectId}`)
        .then((res) => {    
          setWorks(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      }

      const getWork = async () => {
        await axios.get(`http://localhost:8086/api/v1/work/getWork/${openUpdate.data.workId}`)
        .then((res) => {    
            setSelectedWork(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      }

    useEffect(() => {
        getWorks();
        getWork();
    }, [openUpdate.data.projectId]);

 
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const [role, setRole] = useState("");
    const [access, setAccess] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputs, setInputs] = useState({ 
        taskId: openUpdate.data.taskId, 
        taskName: openUpdate.data.taskName, 
        description: openUpdate.data.description, 
        priority: openUpdate.data.priority,
        projectId: openUpdate.data.projectId,
        workId: openUpdate.data.workId,
        dueDate: openUpdate.data.dueDate,
        assignerId: openUpdate.data.userId,
        collaboratorIds: openUpdate.data.collaboratorIds,
        teamIds: openUpdate.data.teamIds,
        tags: openUpdate.data.tags,
    });

    // Update `inputs.selectedWork` when `selectedWork` is fetched
useEffect(() => {
    if (selectedWork) {
        setInputs((prev) => ({
            ...prev,
            selectedWork: selectedWork,
        }));
    }
}, [selectedWork]);


    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "tags") {
            setInputs((prev) => ({
                ...prev,
                [name]: value.split(",").map((tag) => tag.trim()),
            }));
        } else if (name === "workName") {
            const selected = works.find((work) => work.workName.toString() === value);
            setInputs((prev) => ({
                ...prev,
                selectedWork: selected,
            }));
        } else {
            setInputs((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    console.log(inputs);
    

    const updateWorkStatus = async (value) => {
              try {
                console.log(value);
                
                const res = await axios.get(`http://localhost:8082/api/v1/task/getTasksByWorkId/${selectedWork.workId}`);
                
                console.log("res.data: ", res.data);

                if (value.status) {
                    await axios.put(`http://localhost:8086/api/v1/work/updateWorkStatus`, {
                      workId: value.workId,
                      status: false
                    }).then((res) => {
                      console.log("Updated work status: ", res.data);
                    })
                  } else {
                    console.warn("No next work item found in allWorks.");
                  }
            
            
                if (res.data.length === 0 || res.data.every((task) => task.status === true)) {
                  await axios.put(`http://localhost:8086/api/v1/work/updateWorkStatus`, {
                    workId: selectedWork.workId,
                    status: true
                  });
            
                  setUpdateWorkFromTask(true);
                }
              } catch (err) {
                console.error("Error updating work status:", err);
              }
            };
    

    const UpdateTask = async () => {
        setLoading(true);
        setDisabled(true);
        setBackDisabled(true);
        

        await axios.put(`http://localhost:8082/api/v1/task/updateTask`, {
            taskId: inputs.taskId, 
            taskName: inputs.taskName, 
            description: inputs.description, 
            priority: inputs.priority,
            projectId: inputs.projectId,
            workId: inputs.selectedWork.workId,
            assignerId: inputs.assignerId,
            dueDate: inputs.dueDate,
            collaboratorIds: inputs.collaboratorIds,
            teamIds: inputs.teamIds,
            tags: inputs.tags
        })
            .then((res) => {
                updateWorkStatus(inputs.selectedWork);
                setLoading(false);
                setOpenUpdate({ ...openUpdate, state: false });
                dispatch(
                    openSnackbar({
                        message: "Task updated successfully",
                        type: "success",
                    })
                );
                setEditTask(true);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setDisabled(false);
                setBackDisabled(false);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        type: "error",
                    })
                );
            });

    };

    useEffect(() => {
        if (inputs.taskName === "" || inputs.description === "") {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [inputs]);


    const dispatch = useDispatch();

    return (
        <Modal open={true} onClose={() => setOpenUpdate({ ...openUpdate, state: false })}>
            <Container>
                <Wrapper>
                    <IconButton
                        style={{
                            position: "absolute",
                            top: "18px",
                            right: "30px",
                            cursor: "pointer",
                            color: "inherit",
                        }}
                        onClick={() => setOpenUpdate({ ...openUpdate, state: false })}
                    >
                        <CloseRounded style={{ color: "inherit" }} />
                    </IconButton>
                    <Title>Update Task</Title>

                    {showAddProject && (
                        <>
                            <Label>Task Details :</Label>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Title (Required)*"
                                    type="text"
                                    name="taskName"
                                    value={inputs.taskName}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Description (Required)* "
                                    name="description"
                                    rows={5}
                                    value={inputs.description}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>
                            <FlexDisplay style={{ marginTop: "6px" }}>
                            <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                                <select
                                id="workName"
                                name="workName"
                                value={inputs.selectedWork?.workName}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "0",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    color: "#C1C7C9",
                                    border: "none",
                                }}
                                >
                                <option value="" disabled>
                                    Select Work
                                </option>

                                {works.map((work) => (
                                    <option key={work.id} value={work.workName}>
                                    {work.workName}
                                    </option>
                                ))}
                                </select>
                            </OutlinedBox>
                            </FlexDisplay>

                            <FlexDisplay style={{ marginTop: "6px" }}>
                                <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={inputs.priority}
                                    onChange={handleChange}
                                    style={{
                                    width: "100%",
                                    padding: "0",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    color: "#C1C7C9",
                                    border: "none",
                                    }}
                                >
                                    <option value="" disabled>
                                    Select Priority
                                    </option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                                </OutlinedBox>
                                
                                <OutlinedBox style={{ marginTop: "0px", width: "100%" }}>
                                <TextInput
                                    type="text"
                                    onFocus={(e) => (e.target.type = "date")}
                                    onBlur={(e) => (e.target.type = "text")}
                                    id="dueDate"
                                    name="dueDate"
                                    style={{ fontSize: "16px" }}
                                    placeholder="Due Date"
                                    value={inputs.dueDate}
                                    onChange={handleChange}
                                />
                                </OutlinedBox>
                            </FlexDisplay>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                                    name="tags"
                                    rows={4}
                                    value={inputs.tags}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>

                            {openUpdate.type === "all" && (
                            <ButtonContainer>
                                <OutlinedBox
                                    button={true}
                                    activeButton={false}
                                    style={{ marginTop: "18px", width: "100%" }}
                                    onClick={() => {setOpenUpdate({ ...openUpdate, state: false });}}
                                >
                                    Close
                                </OutlinedBox>
                                <OutlinedBox
                                    button={true}
                                    activeButton={!disabled}
                                    style={{ marginTop: "18px", width: "100%" }}
                                    onClick={() => {
                                        !disabled && UpdateTask();
                                    }}
                                >
                                    {Loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : (
                                        "Update Task"
                                    )}
                                </OutlinedBox>
                            </ButtonContainer>
                            )}
                        </>
                    )}
                </Wrapper>
            </Container>
        </Modal>
    );
}

export default UpdateTask