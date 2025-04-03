import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import {
  MoreVert,
  TimelapseRounded,
  StarsRounded,
  PrivacyTipRounded
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { format } from "timeago.js";
import { tagColors } from "../data/data";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@mui/material";
import axios from "axios";

const Container = styled.div`
  padding: 14px;
  text-align: left;
  margin: 0 0 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
  &:hover {
    transition: all 0.6s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin-top: 6px;
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Progress = styled.div`
  position: relative;
`;

const Text = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin: 14px 0px 10px 0px;
  line-height: 1.5;
  overflow: hidden;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ tagColor, theme }) => tagColor + theme.lightAdd};
  background-color: ${({ tagColor, theme }) => tagColor + "10"};
  font-size: 10px;
  font-weight: 500;
`;

const Span = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.soft2};
  line-height: 1.5;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px 14px 0px;
`;

const Time = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2 + "99"};
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;
const IcoBtn = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
`;

const Card = ({ status, work, setWorkUpdated }) => {
  
  const [color, setColor] = useState("primary");
  const [task, setTask] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [progress, setProgress] = useState(0);

  const getTasks = async () => {
    await axios.get(`http://localhost:8082/api/v1/task/getTasksByProjectId/${work.projectId}`)
    .then((res) => {
      console.log(res.data);
      
      const filterData = res.data.filter((item) => item.workId === work.workId);
      setTask(filterData);

    })
    .catch((err) => {
      console.log(err);
    });
  }

  const updateWorkStatus = async () => {
    // await axios.get(`http://localhost:8082/api/v1/task/getTasksByWorkId/${work.workId}`)
    // .then((res) => {
    //   if (res.data.length > 0 && res.data?.every((task) => task.status == false)) {
        
    //     axios.put(`http://localhost:8086/api/v1/work/updateWork`, {
    //       workId: work.workId,
    //       workName: work.workName,
    //       description: work.description,
    //       priority: work.priority,
    //       projectId: work.projectId,
    //       dueDate: work.dueDate,
    //       collaboratorIds: work.collaboratorIds,
    //       teamIds: work.teamIds,
    //       memberIcons: work.memberIcons,
    //       status: false,
    //       tags: work.tags
    //     });

    //     setWorkUpdated(true);
    //   } 
    // }).catch((err) => {
    //   console.log(err);
      
    // })
  }

  useEffect(() => {
    if(work.status === true) {
      updateWorkStatus();
    }
    getTasks();
  }, []);

  console.log(work);
  console.log(task);
  

  useEffect(() => {
    let count = 0;
    let Members = [];
    task.forEach((item) => {
      if (item.status === true) {
        count++;
      }
    
    });
    setCompleted(count);
    setProgress(completed);
  }, [task]);


  return (
    <Link to={`/works/${work.workId}`} style={{ textDecoration: "none" }}>
    <Container className={"item"}>
      <Top>
        <Title>{work.workName}</Title>
        {work.priority === "HIGH" &&
          <>
          <PrivacyTipRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'red' }} />
          <h6 style={{ paddingLeft: "5px" }} >URGENT</h6>
          </>
        }
       
        {work.priority === "MEDIUM" &&
          <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'orange' }} />
        }

        {work.priority === "LOW" &&
          <StarsRounded sx={{ 'font-size': '18px' }} style={{ 'color': 'green' }} />
        }
        <IcoBtn>
          <MoreVert style={{ flex: "1", fontSize: '20px' }} />
        </IcoBtn>
      </Top>
      <Desc>{work.description}</Desc>
      <Tags>
        {work.tags.map((tag) => (
          <Tag
            tagColor={tagColors[Math.floor(Math.random() * tagColors.length)]}
          >
            {tag}
          </Tag>
        ))}
      </Tags>
      <Progress>
        <Text>
          Incompleted Tasks 
          <Span>
            {task.length - completed}
          </Span>
        </Text>
        <LinearProgress
          sx={{ borderRadius: "10px", height: 3 }}
          variant="determinate"
          value={(task.length) * 1}
          color={color}
        />
      </Progress>
      <Bottom>
        <Time>
          <TimelapseRounded sx={{ fontSize: "22px" }} /> Updated{" "}
          {format(work.updatedAt)}
        </Time>
        <AvatarGroup>
          {work.memberIcons.slice(0, 2).map((member) => (
            <Avatar
              sx={{
                marginRight: "-13px",
                width: "26px",
                height: "26px",
                fontSize: "16px",
              }}
            >
              {member.charAt(0)}
            </Avatar>
          ))}
          {work.memberIcons.length > 2 && (
            <Avatar
              sx={{
                marginRight: "-13px",
                width: "26px",
                height: "26px",
                fontSize: "12px",
              }}
            >
              +{work.memberIcons.length - 2}
            </Avatar>
          )}
        </AvatarGroup>
      </Bottom>
    </Container>
    </Link>
  );
};

export default Card;
