import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import axios from "axios";

const Container = styled.div`
  padding: 6px 4px;
  text-align: left;
  margin: 1px 0px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
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
`;

const Role = styled.div`
display: inline-block;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
`;

const Access = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.soft2 + "33"};
`;

const MemberCard = ({ member }) => {
  
  console.log(member);
  

  return (
    <Container>
      <Wrapper>
        {member?.userName ? <Avatar sx={{width: '34px', height: '34px'}}>{member?.userName.charAt(0)}</Avatar> : <Avatar sx={{width: '34px', height: '34px'}}>{member.teamName.charAt(0)}</Avatar>}
        <Details>
          {member?.userName ? <Name>{member.userName}</Name> : <Name>{member.teamName}</Name>}
          {member?.email && <EmailId>{member.email}</EmailId>}
        </Details>

      </Wrapper>
      {member?.role && <Access>{member.role}</Access>}
    </Container>
  );
};

export default MemberCard;
