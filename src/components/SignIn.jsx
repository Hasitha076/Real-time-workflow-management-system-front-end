import {
  CloseRounded,
  EmailRounded,
  Visibility,
  VisibilityOff,
  PasswordRounded
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IconButton, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { loginFailure, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import validator from "validator";
import axios from "axios";
import DraftsIcon from '@mui/icons-material/Drafts';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from "react-router-dom";
import OTPInput from "./OTP";

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
  margin: 20px 20px 30px 20px;
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
  ${({ error, theme }) =>
    error === "" &&
    `    display: none;
    `}
`;

const ForgetPassword = styled.div`
  color: ${({ theme }) => theme.soft2};
  font-size: 13px;
  margin: 8px 26px;
  display: block;
  cursor: pointer;
  text-align: right;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  `;

const SignIn = ({ SignInOpen, setSignInOpen, setSignUpOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  //verify otp
  const [showOTP, setShowOTP] = useState(false);
  //reset password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [samepassword, setSamepassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmedpassword, setConfirmedpassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [resetDisabled, setResetDisabled] = useState(true);
  const [OTP, setOTP] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (email !== "") validateEmail();
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async () => {
  
    if (!disabled) {

      await axios.post("http://localhost:8081/api/v1/auth/login", {
        email: email,
        password: password,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.body === "User not found") {
            dispatch(loginFailure());
            dispatch(
              openSnackbar({
                message: "User not found",
                severity: "error",
              })
            );
          }
          else if (res.data.body.user != undefined) {
            dispatch(loginSuccess(res.data.body));
            dispatch(
              openSnackbar({
                message: "User Login Successfully",
                severity: "success",
              })
            );
            setSignInOpen(false);
            navigate("/dashboard")
          }
          else {
            dispatch(loginFailure());
            dispatch(
              openSnackbar({
                message: "Invalid credentials",
                severity: "error",
              })
            );
          }
        })
        .catch((err) => {
          dispatch(loginFailure());
          dispatch(
            openSnackbar({
              message: "Invalid Credentials",
              severity: "error",
            })
          );
      })
      setDisabled(true);
      setLoading(true);
    }
    if (email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
    }
  };

  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");

  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
      setResetDisabled(false);
    } else {
      setEmailError("Enter a valid Email");
      setResetDisabled(true);
    }
  };


  //validate password
  const validatePassword = () => {
    if (newpassword.length < 8) {
      setSamepassword("Password must be atleast 8 characters long!");
      setPasswordCorrect(false);
    } else if (newpassword.length > 16) {
      setSamepassword("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !newpassword.match(/[a-z]/g) ||
      !newpassword.match(/[A-Z]/g) ||
      !newpassword.match(/[0-9]/g) ||
      !newpassword.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setSamepassword(
        "Password must contain atleast one lowercase, uppercase, number and special character!"
      );
    }
    else {
      setSamepassword("");
      setPasswordCorrect(true);
    }
  };

  useEffect(() => {
    if (newpassword !== "") validatePassword();
    if (
      passwordCorrect
      && newpassword === confirmedpassword
    ) {
      setSamepassword("");
      setResetDisabled(false);
    } else if (confirmedpassword !== "" && passwordCorrect) {
      setSamepassword("Passwords do not match!");
      setResetDisabled(true);
    }
  }, [newpassword, confirmedpassword]);


  const sendOtp = async () => {
    console.log(email);

    const data = {
      email: email,
    }
    
    await axios.post("http://localhost:8081/api/v1/auth/generateOTP", data)
      .then((res) => {
        console.log(res.data.body);
        if (res.data.body === "User not found") {
          setEmailError("User not found");
        }
        else {
          setOTP(res.data.body);
          dispatch(
            openSnackbar({
              message: "OTP sent to your email",
              severity: "success",
            })
          );
          setShowOTP(true);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: "Something went wrong",
            severity: "error",
          })
        );
        console.log(err);
    });
    
  }


  const resetPassword = async () => {
    console.log(email, newpassword);
    
    await axios.post("http://localhost:8081/api/v1/auth/resetPassword", {
      email: email,
      password: newpassword
    })
      .then((res) => {
        console.log(res.data.body);
          if (res.data.body === "Password reset successfully") {
            dispatch(
              openSnackbar({
                message: "Password reset successfully",
                severity: "success",
              })
            );
            setShowForgotPassword(false);
            setShowNewPassword(false);
          }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: "Something went wrong",
            severity: "error",
          })
        );
        console.log(err);
    });
  }


  return (
    <Modal open={SignInOpen} onClose={() => setSignInOpen(false)}>
      <Container>
        {!showForgotPassword ? (
          <Wrapper>
            <CloseRounded
              style={{
                position: "absolute",
                top: "24px",
                right: "30px",
                cursor: "pointer",
              }}
              onClick={() => setSignInOpen(false)}
            />
            <>
              <Title>Sign In</Title>

              <OutlinedBox style={{ marginTop: "10px" }}>
                <DraftsIcon
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <TextInput
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </OutlinedBox>
              <Error error={emailError}>{emailError}</Error>
              <OutlinedBox>
                <LockOpenIcon
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <TextInput
                  placeholder="Password"
                  type={values.showPassword ? "text" : "password"}
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
              <ForgetPassword onClick={() => { setShowForgotPassword(true) }}><b>Forgot password ?</b></ForgetPassword>
              <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: "6px" }}
                onClick={handleLogin}
              >
                {Loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Login"
                )}
              </OutlinedBox>
            </>
            <LoginText>
              Don't have an account ?
              <Span
                onClick={() => {
                  setSignUpOpen(true);
                  setSignInOpen(false);
                }}
                style={{
                  fontWeight: "500",
                  marginLeft: "6px",
                  cursor: "pointer",
                }}
              >
                Create Account
              </Span>
            </LoginText>
          </Wrapper>
        ) : (
          <Wrapper>
            <CloseRounded
              style={{
                position: "absolute",
                top: "5px",
                right: "30px",
                cursor: "pointer",
              }}

            />
                    <OutlinedBox style={{ marginTop: "24px" }}>
                      <EmailRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <TextInput
                        placeholder="Email Id"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </OutlinedBox>
                    <Error error={emailError}>{emailError}</Error>
                    {showNewPassword && (
                      <>
                      <OutlinedBox>
                      <PasswordRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <TextInput
                        placeholder="New Password"
                        type={values.showPassword ? "text" : "password"}
                        onChange={(e) => setNewpassword(e.target.value)}
                      />
                    </OutlinedBox>
                    <OutlinedBox>
                      <PasswordRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <TextInput
                        placeholder="Confirm Password"
                        type={values.showPassword ? "text" : "password"}
                        onChange={(e) => setConfirmedpassword(e.target.value)}
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
                    <Error error={samepassword}>{samepassword}</Error></>
                    )}

                    {showNewPassword ? 
                      <OutlinedBox
                        button={true}
                        activeButton={!resetDisabled}
                        style={{ marginTop: "6px", marginBottom: "24px" }}
                        onClick={() => resetPassword()}
                        >
                        Reset Password
                    </OutlinedBox> :
                    <OutlinedBox
                      button={true}
                      activeButton={!resetDisabled}
                      style={{ marginTop: "6px", marginBottom: "24px" }}
                      onClick={() => sendOtp()}
                      >
                      Send OTP
                  </OutlinedBox>}
                    
                    {showOTP && (
                      <OTPInput option={OTP} setShowNewPassword={setShowNewPassword} setResetDisabled={setResetDisabled} setShowOTP={setShowOTP} />
                    )}
                    <LoginText>
                      Don't have an account ?
                      <Span
                        onClick={() => {
                          setSignUpOpen(true);
                          setSignInOpen(false);
                        }}
                        style={{
                          fontWeight: "500",
                          marginLeft: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Create Account
                      </Span>
                    </LoginText>

          </Wrapper>

        )}
      </Container>
    </Modal>
  );
};

export default SignIn;
