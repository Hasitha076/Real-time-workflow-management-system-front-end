import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { tagColors } from "../data/data";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import UserCard from "../components/UserCard";

const Container = styled.div`
  padding: 14px 14px;
  @media screen and (max-width: 480px) {
    padding: 10px 4px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: row;
  margin: 12px 0px;
  @media screen and (max-width: 480px) {
    margin: 6px 0px;
    flex-direction: column;
  }
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  @media screen and (max-width: 480px) {
    width: 95%;
  }
  padding: 4px 8px;
  text-align: left;
  margin: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  padding: 0 0px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const OutlinedBox = styled.div`
  min-height: 44px;
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
    background: ${theme.card}; `}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
    margin-top: 8px;
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


const Members = ({setNewUser, userCreated, setUserCreated}) => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);

  console.log(token);
  

  const getAvailableMember = async () => {
    if (!token) {
      console.error("JWT token is missing");
      return;
    } else {
        console.log("JWT token is present");
    }
  
    try {
      const response = await axios.get("http://localhost:8081/api/v1/user/getAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":   "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
  
      setUsers(response.data);
      loading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  

  useEffect(() => {
    getAvailableMember();
  }, []);

  useEffect(() => {
    if(userCreated) {
        getAvailableMember();
        setUserCreated(false);
    }
  }, [userCreated]);

  console.log(users);


  return (
    <Container>
      {!loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px',height: '300px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
            <Column>
              <ItemWrapper>
                <Wrapper>
                <OutlinedBox button onClick={() => setNewUser(true)} style={{ marginBottom: "12px" }}>
                    New User
                  </OutlinedBox>
                </Wrapper>
                <Wrapper>
               
                    {users.map((item, idx) => (
                      
                      <UserCard
                        key={item.userId}
                        users={item}
                        index={idx}
                        tagColor={tagColors[3]}
                      />
                      
                    ))}
                </Wrapper>
              </ItemWrapper>
              
            </Column>

        </>
      )}
    </Container>
  );
};

export default Members;
