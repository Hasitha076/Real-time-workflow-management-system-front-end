import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { tagColors } from "../data/data";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import TeamCards from "../components/TeamCards";
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
  padding: 12px 0px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;


const Members = () => {
  const { id } = useParams();
  const [item, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  const [users, setUsers] = useState([]);

  const getAvailableTeams = async () => {
    await axios.get("http://localhost:8081/api/v1/user/getAllUsers")
    .then((res) => {
        setUsers(res.data);
      loading(false);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    getAvailableTeams();
  }, []);

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
