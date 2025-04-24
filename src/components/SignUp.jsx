import {
  CloseRounded,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { IconButton, Modal } from "@mui/material";
import { openSnackbar } from "../redux/snackbarSlice";
import { loginFailure } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import DraftsIcon from "@mui/icons-material/Drafts";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #000000b8;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 400px;
  border-radius: 0;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.black};
  margin: 16px 28px;
`;

const OutlinedBox = styled.div`
  height: 44px;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
    border: none;
    background: ${theme.itemHover};
    color: ${theme.soft2};`}
  ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
    border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
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

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  margin: 20px 20px 38px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const Error = styled.div`
  color: red;
  font-size: 10px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error }) =>
    error === "" &&
    `display: none;`}
`;

const SignUp = ({ SignUpOpen, setSignUpOpen, setSignInOpen }) => {
  const [nameValidated, setNameValidated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [credentialError, setcredentialError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameCorrect, setNameCorrect] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [otpVerified, setOtpVerified] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();

  const createAccount = () => {};

  const handleSignUp = async () => {
    if (!disabled) {
      await axios
        .post("http://localhost:8081/api/v1/auth/register", {
          userName: name,
          email: email,
          password: password,
        })
        .then((res) => {
          if (res.data === "Username already exists") {
            dispatch(
              openSnackbar({
                message: "User already exists",
                severity: "error",
              })
            );
          } else {
            dispatch(
              openSnackbar({
                message: "Registered Successfully",
                severity: "success",
              })
            );
            setSignUpOpen(false);
            setSignInOpen(true);
          }
        })
        .catch(() => {
          dispatch(loginFailure());
          dispatch(
            openSnackbar({
              message: "Invalid Credentials",
              severity: "error",
            })
          );
        });
      setDisabled(true);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (email !== "") validateEmail();
    if (password !== "") validatePassword();
    if (name !== "") validateName();
    if (
      name !== "" &&
      validator.isEmail(email) &&
      passwordCorrect &&
      nameCorrect
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, passwordCorrect, password, nameCorrect]);

  useEffect(() => {
    createAccount();
  }, [otpVerified]);

  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email");
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setcredentialError("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setcredentialError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !password.match(/[a-z]/g) ||
      !password.match(/[A-Z]/g) ||
      !password.match(/[0-9]/g) ||
      !password.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setcredentialError(
        "Password must contain at least one lowercase, uppercase, number, and special character!"
      );
    } else {
      setcredentialError("");
      setPasswordCorrect(true);
    }
  };

  const validateName = () => {
    if (typeof name !== "string") {
      setNameValidated(false);
      setNameCorrect(false);
      setNameError("Name must be a string");
    } else if (!isNaN(name)) {
      setNameValidated(false);
      setNameCorrect(false);
      setNameError("Name must be a string");
    } else if (name.trim() === "") {
      setNameValidated(false);
      setNameCorrect(false);
      setNameError("Name cannot be empty!");
    } else if (name.trim().length < 4) {
      setNameValidated(false);
      setNameCorrect(false);
      setNameError("Name must be at least 4 characters long");
    } else {
      setNameCorrect(true);
      setNameValidated(true);
      setNameError("");
    }
  };

  return (
    <Modal open={SignUpOpen} onClose={() => setSignUpOpen(false)}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: "absolute",
              top: "24px",
              right: "30px",
              cursor: "pointer",
            }}
            onClick={() => setSignUpOpen(false)}
          />
          <Title>Sign Up</Title>

          <OutlinedBox style={{ marginTop: "10px" }}>
            <Person sx={{ fontSize: "20px" }} style={{ paddingRight: "12px" }} />
            <TextInput
              placeholder="Full Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </OutlinedBox>
          <Error error={nameError}>{nameError}</Error>
          <OutlinedBox>
            <DraftsIcon sx={{ fontSize: "20px" }} style={{ paddingRight: "12px" }} />
            <TextInput
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </OutlinedBox>

          <Error error={emailError}>{emailError}</Error>

          <OutlinedBox>
            <LockOpenIcon sx={{ fontSize: "20px" }} style={{ paddingRight: "12px" }} />
            <TextInput
              type={values.showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconButton
              color="inherit"
              onClick={() =>
                setValues({ ...values, showPassword: !values.showPassword })
              }
            >
              {values.showPassword ? (
                <Visibility sx={{ fontSize: "20px" }} />
              ) : (
                <VisibilityOff sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
          </OutlinedBox>

          <Error error={credentialError}>{credentialError}</Error>

          <OutlinedBox
            button={true}
            activeButton={!disabled}
            style={{ marginTop: "6px" }}
            onClick={handleSignUp}
          >
            {Loading ? <CircularProgress color="inherit" size={20} /> : "Register"}
          </OutlinedBox>

          <LoginText>
            Already have an account?
            <Span
              onClick={() => {
                setSignUpOpen(false);
                setSignInOpen(true);
              }}
              style={{
                fontWeight: "500",
                marginLeft: "6px",
                cursor: "pointer",
              }}
            >
              Sign In
            </Span>
          </LoginText>
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default SignUp;
