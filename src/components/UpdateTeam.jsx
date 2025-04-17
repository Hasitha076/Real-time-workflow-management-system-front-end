import { IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
    CloseRounded
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { openSnackbar } from "../redux/snackbarSlice";

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

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;


const UpdateTeam = ({ openUpdate, setOpenUpdate }) => {
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const [showAddTeam, setShowAddTeam] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [backDisabled, setBackDisabled] = useState(false);

    const goToAddTeam = () => {
        setShowAddTeam(true);
        setShowAddMember(false);
    };

    const goToAddMember = () => {
        setShowAddTeam(false);
        setShowAddMember(true);
    };

    useEffect(() => {

        if (openUpdate.type === "all") {
            goToAddTeam();
        } else if (openUpdate.type === "member") {
            goToAddMember();
        }

    }, [openUpdate]);

    const { currentUser } = useSelector((state) => state.user);
    const [inputs, setInputs] = useState(
        { 
            id: openUpdate.data.teamId, 
            name: openUpdate.data.teamName, 
            description: openUpdate.data.teamDescription, 
            tags: openUpdate.data.tags,
            collaboratorIds: openUpdate.data.collaboratorIds
        });


    const handleChange = (e) => {
        setInputs((prev) => {
            if (e.target.name === "tags") {
                return { ...prev, [e.target.name]: e.target.value.split(",") };
            } else {
                return { ...prev, [e.target.name]: e.target.value };
            }
        });
    };

    useEffect(() => {
        if (inputs.teamName === "" || inputs.description === "") {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [inputs])


    const dispatch = useDispatch();

    console.log(openUpdate);
    console.log(inputs);
    

    const UpdateTeam = async () => {
        setLoading(true);
        setDisabled(true);
        setBackDisabled(true);

        console.log(inputs);

        await axios.put(`http://localhost:8085/api/v1/team/updateTeam`, {
            teamId: inputs.id, 
            teamName: inputs.name, 
            teamDescription: inputs.description,
            tags: inputs.tags,
            collaboratorIds: inputs.collaboratorIds
        })
            .then((res) => {
                console.log(res);
                setLoading(false);
                setOpenUpdate({ ...openUpdate, state: false });
                dispatch(
                    openSnackbar({
                        message: "Team updated successfully",
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
                    <Title>Update Team</Title>

                    {showAddTeam && (
                        <>
                            <Label>Team Details :</Label>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Team Name (Required)*"
                                    type="text"
                                    name="name"
                                    value={inputs.name}
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
                            <OutlinedBox style={{ marginTop: "6px" }}>
                                <Desc
                                    placeholder="Tags: seperate by , eg- Mongo Db , React JS .."
                                    name="tags"
                                    rows={4}
                                    value={inputs.tags}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>

                            <OutlinedBox
                                button={true}
                                activeButton={!disabled}
                                style={{ marginTop: "22px", marginBottom: "18px" }}
                                onClick={() => { !disabled && UpdateTeam() }}
                            >
                                Next
                            </OutlinedBox>
                        </>
                    )}

                </Wrapper>
            </Container>
        </Modal>
    );
};

export default UpdateTeam;
