import React, { useState } from "react";
import { Avatar, Box, Button, Menu, MenuItem } from "@mui/material";
import styled from "styled-components";

const OutlinedBox = styled.div`
  min-height: 100px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 15px;
`;

const Description = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.textSoft};
`;

const CommentButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.primary + "cc"};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  background-color: transparent;
  border: none;
`;

const CommentCard = ({ item, allTaskMembers }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleComment = () => {
    // Logic to add or update a comment
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditComment = (index) => {
    setEditedComment(item.comments[index].comment); // Access 'comment' field
    setEditCommentIndex(index);
    handleMenuClose();
  };

  const handleDeleteComment = (index) => {
    // Logic to delete the comment
    console.log(`Delete comment at index ${index}`);
    handleMenuClose();
  };

  const handleCommentUpdate = () => {
    // Logic to update the comment
    console.log(`Updated comment: ${editedComment}`);
    setEditCommentIndex(null);
  };

  const displayedComments = showAllComments ? item.comments : [item.comments[item.comments.length - 1]];
  

  return (
    <Box>
      {item.comments.length > 1 && (
        <Button
          size="small"
          onClick={() => setShowAllComments(!showAllComments)}
          sx={{ marginTop: "10px", textTransform: "none" }}
        >
          {showAllComments ? "View Less" : `View More (${item.comments.length - 1} more)`}
        </Button>
      )}
      {item.comments.length !== 0 &&
        displayedComments.map((commentObj, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              paddingTop: "10px",
            }}
          >
            {allTaskMembers
              .filter((m) => m.userId === commentObj.userId)
              .slice(0, 1)
              .map((member, memberIndex) => (
                <Avatar
                  key={memberIndex}
                  sx={{
                    marginRight: "5px",
                    width: "26px",
                    height: "26px",
                    fontSize: "16px",
                  }}
                >
                  {member.userName.charAt(0)}
                </Avatar>
              ))}

            {editCommentIndex === index ? (
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <OutlinedBox style={{ marginTop: "6px", width: "-webkit-fill-available" }}>
                  <Description
                    placeholder="Add a comment"
                    name="description"
                    rows={5}
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                </OutlinedBox>
                <ButtonGroup>
                  <CommentButton onClick={() => setEditCommentIndex(null)}>Close</CommentButton>
                  <CommentButton onClick={handleCommentUpdate}>Update</CommentButton>
                </ButtonGroup>
              </Box>
            ) : (
              <p style={{ margin: "0", padding: "0 5px" }}>{commentObj.comment}</p>
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleEditComment(index)}>Edit Comment</MenuItem>
              <MenuItem onClick={() => handleDeleteComment(index)}>Delete Comment</MenuItem>
            </Menu>
          </Box>
        ))}
    </Box>
  );
};

export default CommentCard;