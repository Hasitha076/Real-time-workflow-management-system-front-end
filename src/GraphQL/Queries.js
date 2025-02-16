import { gql } from "@apollo/client";

// Query to load all projects
export const LOAD_ALL_PROJECTS = gql`
  query {
    getAllProjects {
      projectId
      projectName
      projectDescription
      priority
      assignerId
      tags
      dueDate
      collaboratorIds
      teamIds
      memberIcons
      status
      createdAt
      updatedAt
    }
  }
`;

// Query to load a single project by ID
export const LOAD_PROJECT_BY_ID = gql`
  query getProject($id: Int!) {
    getProject(id: $id) {
      projectId
      projectName
      projectDescription
      priority
      assignerId
      tags
      dueDate
      collaboratorIds
      teamIds
      memberIcons
      status
      createdAt
      updatedAt
    }
  }
`;

// Query to load projects by team ID
export const LOAD_PROJECTS_BY_TEAM_ID = gql`
  query getProjectsByTeamId($teamId: Int!) {
    getProjectsByTeamId(teamId: $teamId) {
      projectId
      projectName
      projectDescription
      priority
      assignerId
      tags
      dueDate
      collaboratorIds
      teamIds
      memberIcons
      status
      createdAt
      updatedAt
    }
  }
`;

// Mutation to create a project
export const CREATE_PROJECT = gql`
  mutation createProject($input: ProjectInput!) {
    createProject(input: $input)
  }
`;

// Mutation to update a project
export const UPDATE_PROJECT = gql`
  mutation updateProject($input: ProjectInput!) {
    updateProject(input: $input)
  }
`;

// Mutation to delete a project
export const DELETE_PROJECT = gql`
  mutation deleteProject($id: Int!) {
    deleteProject(id: $id)
  }
`;

// Mutation to update collaborators
export const UPDATE_COLLABORATORS = gql`
  mutation updateCollaborators($projectId: Int!, $input: CollaboratorsAndTeamsInput!) {
    updateCollaborators(projectId: $projectId, input: $input)
  }
`;

// Input Type Definition for Project
export const PROJECT_INPUT_TYPE = gql`
  input ProjectInput {
    projectId: ID
    projectName: String!
    projectDescription: String!
    priority: ProjectPriorityLevel
    assignerId: Int
    tags: [String]
    dueDate: LocalDate
    collaboratorIds: [Int]
    teamIds: [Int]
    memberIcons: [String]
    status: ProjectStatus
  }
`;

// Input Type Definition for Collaborators
export const COLLABORATORS_INPUT_TYPE = gql`
  input CollaboratorsAndTeamsInput {
    collaboratorIds: [Int]!
    teamIds: [Int]!
  }
`;
