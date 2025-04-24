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
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../GraphQL/Queries";

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
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 0;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  cursor: pointer;
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
   &:hover {
    transition: all 0.6s ease-in-out;
    background: ${({ theme }) => theme.soft};
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
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

const AddNewUser = ({ setNewUser, setUserCreated }) => {
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [backDisabled, setBackDisabled] = useState(false);
  const [showAddUser, setShowAddUser] = useState(true);
  const [createProject] = useMutation(CREATE_PROJECT);
  const token = localStorage.getItem("token");

  const goToAddUser = () => {
    setShowAddUser(true);
  };

  const [inputs, setInputs] = useState({ 
      userName: "", 
      email: "",
      password: "",
      role: ""
    });

  const handleChange = (e) => {
    setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const CreateUser = async () => {
    setLoading(true);
    setDisabled(true);

    axios.post("http://localhost:8081/api/v1/auth/register", {
        userName: inputs.userName,
        email: inputs.email,
        password: inputs.password,
        role: inputs.role
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":   "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
      )
        .then((res) => {

          if(res.data === "Username already exists") {
            dispatch(
              openSnackbar({
                message: "Username already exists",
                type: "error",
              })
            );
          }
          else {
            setLoading(false);
          setNewUser(false);
          setUserCreated(true);
          dispatch(
            openSnackbar({
              message: "User created successfully",
              type: "success",
            })
          );
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setDisabled(false);
          setBackDisabled(false);
          dispatch(
            openSnackbar({
              message: "Something went wrong",
              type: "error",
            })
          );
        });

  };

  useEffect(() => {
    if (inputs.userName === "" || inputs.email === "" || inputs.password === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [inputs]);

  const dispatch = useDispatch();

  return (
    <Modal open={true} onClose={() => setNewUser(false)}>
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
            onClick={() => setNewUser(false)}
          >
            <CloseRounded style={{ color: "inherit" }} />
          </IconButton>
          <Title>Create a new user</Title>

          {showAddUser && (
            <>
              <Label>User Details :</Label>
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  placeholder="Name (Required)*"
                  type="text"
                  name="userName"
                  value={inputs.userName}
                  onChange={handleChange}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <TextInput
                  placeholder="Email (Required)* "
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <TextInput
                type="password"
                  placeholder="Password (Required)* "
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                />
              </OutlinedBox>
                <OutlinedBox style={{ marginTop: "6px" }}> 
                  <select
                    id="role"
                    name="role"
                    value={inputs.role}
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
                      Select Role
                    </option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                    <option value="QA">QA</option>
                    <option value="USER">USER</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </OutlinedBox>
                <ButtonContainer>
                <OutlinedBox
                  button={true}
                  activeButton={false}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !backDisabled && goToAddUser();
                  }}
                >
                  Back
                </OutlinedBox>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "18px", width: "100%" }}
                  onClick={() => {
                    !disabled && CreateUser();
                  }}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Create User"
                  )}
                </OutlinedBox>
              </ButtonContainer>
            </>
          )}
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default AddNewUser;
