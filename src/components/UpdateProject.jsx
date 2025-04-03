import { IconButton, Modal, Snackbar } from "@mui/material";
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
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "../GraphQL/Queries";


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
  padding: 20px;
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
  margin: 3px 0px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px 0px;
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

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 12px 18px;
`;

const Icon = styled.img`
  width: 16px;
  margin: 0px 6px 0px 0px;
`;

const AddMember = styled.div`
  margin: 22px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgDark + "98"};
`;

const Search = styled.div`
  margin: 6px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
  background-color: ${({ theme }) => theme.bgDark};
`;

const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 100px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const UsersList = styled.div`
  padding: 18px 8px;
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`;
const UserData = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Details = styled.div`
  gap: 4px;
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
`;

const EmailId = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft + "99"};
  line-break: anywhere;
`;

const Flex = styled.div`
display: flex;
flex-direction: row;
gap: 2px;
@media (max-width: 768px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;

const Access = styled.div`
padding: 6px 10px;
border-radius: 12px;
display: flex;
align-items: center;
justify-content: center;
font-size: 12px;
background-color: ${({ theme }) => theme.bgDark};
`;

const Select = styled.select`
  border: none;
  font-size: 12px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgDark};
`;

const Role = styled.div`
  background-color: ${({ theme }) => theme.bgDark};
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const InviteButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 1px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  border-radius: 10px;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
`;

const FlexDisplay = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;

const UpdateProject = ({ openUpdate, setOpenUpdate, setProjectUpdated }) => {
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [backDisabled, setBackDisabled] = useState(false);

    const [showAddProject, setShowAddProject] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);

    const [updateProject] = useMutation(UPDATE_PROJECT);


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
    const { currentUser } = useSelector((state) => state.user);
    const [role, setRole] = useState("");
    const [access, setAccess] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputs, setInputs] = useState(
        { 
            projectId: openUpdate.data.projectId, 
            projectName: openUpdate.data.projectName, 
            projectDescription: openUpdate.data.projectDescription, 
            priority: openUpdate.data.priority, 
            tags: openUpdate.data.tags, 
            collaboratorIds: openUpdate.data.collaboratorIds, 
            status: openUpdate.data.status,
            dueDate: openUpdate.data.dueDate,
            teamIds: openUpdate.data.teamIds, 
            members: openUpdate.data.memberIcons
         });

         console.log("Project details: ", openUpdate.data);
         

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

    const UpdateProject = async () => {
        setLoading(true);
        setDisabled(true);
        setBackDisabled(true);

        // await axios.put(`http://localhost:8083/api/v1/project/updateProject`, {
        //     projectId: inputs.projectId, 
        //     projectName: inputs.projectName, 
        //     projectDescription: inputs.projectDescription, 
        //     priority: inputs.priority, 
        //     tags: inputs.tags, 
        //     status: inputs.status,
        //     dueDate: inputs.dueDate,
        //     collaboratorIds: inputs.collaboratorIds, 
        //     teamIds: inputs.teamIds, 
        //     members: inputs.memberIcons
        // })
        //     .then((res) => {
        //         setLoading(false);
        //         setOpenUpdate({ ...openUpdate, state: false });
        //         dispatch(
        //             openSnackbar({
        //                 message: "Project updated successfully",
        //                 type: "success",
        //             })
        //         );
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         setLoading(false);
        //         setDisabled(false);
        //         setBackDisabled(false);
        //         dispatch(
        //             openSnackbar({
        //                 message: err.message,
        //                 type: "error",
        //             })
        //         );
        //     });


            await updateProject({
                variables: {
                  input: {
                    projectId: inputs.projectId, 
                    projectName: inputs.projectName, 
                    projectDescription: inputs.projectDescription, 
                    priority: inputs.priority, 
                    tags: inputs.tags, 
                    status: inputs.status,
                    dueDate: inputs.dueDate,
                    collaboratorIds: inputs.collaboratorIds, 
                    teamIds: inputs.teamIds, 
                    members: inputs.memberIcons
                  },
                },
              }).then((res) => {
                setLoading(false);
                setOpenUpdate({ ...openUpdate, state: false });
                setProjectUpdated(true);
                dispatch(
                    openSnackbar({
                        message: "Project updated successfully",
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
        if (inputs.projectName === "" || inputs.projectDescription === "") {
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
                    <Title>Update Project</Title>

                    {showAddProject && (
                        <>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Title (Required)*"
                                    type="text"
                                    name="projectName"
                                    value={inputs.projectName}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Description (Required)* "
                                    name="projectDescription"
                                    rows={5}
                                    value={inputs.projectDescription}
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
                                <select
                                    id="status"
                                    name="status"
                                    value={inputs.status}
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
                                    Select Status
                                    </option>
                                    <option value="PENDING">Pending</option>
                                    <option value="ON_GOING">On Going</option>
                                    <option value="COMPLETED">Complete</option>
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
                                        !disabled && UpdateProject();
                                    }}
                                >
                                    {Loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : (
                                        "Update Project"
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

export default UpdateProject