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
  padding: 10px 30px;
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

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 12px 0 0px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
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

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;


const UpdateMember = ({ openUpdate, setOpenUpdate }) => {
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [showAddTeam, setShowAddTeam] = useState(true);
    const [showAddMember, setShowAddMember] = useState(false);
    const [backDisabled, setBackDisabled] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

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

    const [inputs, setInputs] = useState(
        { 
            id: openUpdate.data.userId, 
            name: openUpdate.data.userName, 
            role: openUpdate.data.role,
            status: openUpdate.data.status
        });


    const handleChange = (e) => {
        setInputs((prev) => {
            if(e.target.name === "status") {
                return { ...prev, [e.target.name]: e.target.value === "true" ? true : false };
            }
            else {
                return { ...prev, [e.target.name]: e.target.value };
            }
        });
    };

    useEffect(() => {
        if (inputs.userName === "") {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [inputs])

    const UpdateTeam = async () => {
        setLoading(true);
        setDisabled(true);
        setBackDisabled(true);

        await axios.put(`http://localhost:8081/api/v1/user/updateUser`, {
            userId: inputs.id, 
            userName: inputs.name, 
            role: inputs.role,
            status: inputs.status
        })
            .then((res) => {
                setLoading(false);
                setOpenUpdate({ ...openUpdate, state: false });
                dispatch(
                    openSnackbar({
                        message: "Member updated successfully",
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
                    <Title>Update Member</Title>

                    {showAddTeam && (
                        <>
                            <Label>Member Details :</Label>
                            <OutlinedBox style={{ marginTop: "12px" }}>
                                <TextInput
                                    placeholder="Team Name (Required)*"
                                    type="text"
                                    name="name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                />
                            </OutlinedBox>
                            <ButtonContainer>
                            <OutlinedBox style={{ marginTop: "6px", width: "100%" }}> 
                            <select
                                id="role"
                                name="role"
                                value={inputs.role}
                                onChange={handleChange}
                                disabled={currentUser.role === "ADMIN" ? false : true}
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
                                Select Role
                                </option>
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="DEVELOPER">Developer</option>
                                <option value="QA">QA</option>
                                <option value="GUEST">Guest</option>
                            </select>
                            </OutlinedBox>

                            <OutlinedBox style={{ marginTop: "6px", width: "100%" }}> 
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
                                <option value='true'>Active</option>
                                <option value="false">Inactive</option>
                            </select>
                            </OutlinedBox>
                            </ButtonContainer>

                            <OutlinedBox
                                button={true}
                                activeButton={!disabled}
                                style={{ marginTop: "22px", marginBottom: "18px" }}
                                onClick={() => { !disabled && UpdateTeam() }}
                            >
                                Update User
                            </OutlinedBox>
                        </>
                    )}

                </Wrapper>
            </Container>
        </Modal>
    );
};

export default UpdateMember;
