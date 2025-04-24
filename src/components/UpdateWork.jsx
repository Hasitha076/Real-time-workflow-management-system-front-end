import { IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {
    CloseRounded
} from "@mui/icons-material";
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px 20px;
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
  margin: 12px 20px 0px 20px;
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
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 12px 20px;
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

const UpdateWork = ({ openUpdate, setOpenUpdate }) => {

    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [backDisabled, setBackDisabled] = useState(false);
    const [showAddProject, setShowAddProject] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);

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

    //add member part
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("");
    const [access, setAccess] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputs, setInputs] = useState({ 
        workId: openUpdate.data.workId, 
        workName: openUpdate.data.workName, 
        description: openUpdate.data.description, 
        priority: openUpdate.data.priority,
        projectId: openUpdate.data.projectId,
        status: openUpdate.data.status,
        dueDate: openUpdate.data.dueDate,
        collaboratorIds: openUpdate.data.collaboratorIds,
        teamIds: openUpdate.data.teamIds,
        memberIcons: openUpdate.data.memberIcons,
        tags: openUpdate.data.tags
    });

    const handleSelect = (user) => {
        const User = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        if (selectedUsers.find((u) => u.id === User.id)) {
        } else {
            setSelectedUsers([...selectedUsers, {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,
                access: access,
            }]);
            setUsers([]);
            setAccess("");
            setRole("");
            setSearch("");
        }
    };

    //remove members from selected users
    const handleRemove = (user) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    };


    const handleChange = (e) => {
        setInputs((prev) => {
            if (e.target.name === "tags") {
                return { ...prev, [e.target.name]: e.target.value.split(",") };
            } else {
                return { ...prev, [e.target.name]: e.target.value };
            }
        });
    };

    const UpdateWork = async () => {
        setLoading(true);
        setDisabled(true);
        setBackDisabled(true);
        

        await axios.put(`http://localhost:8086/api/v1/work/updateWork`, {
            workId: inputs.workId, 
            workName: inputs.workName, 
            description: inputs.description, 
            priority: inputs.priority,
            projectId: inputs.projectId,
            status: inputs.status,
            dueDate: inputs.dueDate,
            collaboratorIds: inputs.collaboratorIds,
            teamIds: inputs.teamIds,
            memberIcons: inputs.memberIcons,
            tags: inputs.tags
        })
            .then((res) => {
                setLoading(false);
                setOpenUpdate({ ...openUpdate, state: false });
                dispatch(
                    openSnackbar({
                        message: "Work updated successfully",
                        type: "success",
                    })
                );
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
        if (inputs.workName === "" || inputs.description === "") {
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
                    <Title>Update Work</Title>

                    {showAddProject && (
                        <>
                            <Label>Work Details :</Label>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Title (Required)*"
                                    type="text"
                                    name="workName"
                                    value={inputs.workName}
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
                                        !disabled && UpdateWork();
                                    }}
                                >
                                    {Loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : (
                                        "Update Work"
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

export default UpdateWork