import { gql } from "@apollo/client";

export const LOAD_ALL_PROJECTS = gql`
  query {
    getAllProjects {
        projectName
        createdAt
        updatedAt
        dueDate
        assignerId
        collaboratorIds
        memberIcons
        priority
        projectDescription
        projectId
        status
        tags
        teamIds
    }
  }
`;