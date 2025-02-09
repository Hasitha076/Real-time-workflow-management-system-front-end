import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { styled } from "styled-components";
import { Modal, IconButton } from "@mui/material";
import {
    CloseRounded
  } from "@mui/icons-material";


const Container = styled.div`
    display: 'flex';
    justify-Content: 'center';
    align-Items: 'center';
    overflow: auto;
    max-height: 100%;
`

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100%;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  position: relative;
    left: 0;
    right: 0;
    margin: 2% auto;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px 0;
  text-transform: uppercase;
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

const OutlinedButton = styled.div`
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: #fff;
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
    font-size: 13px;
    background: ${theme.soft};
    color:'${theme.soft2}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background-color: ${theme.primary};
    color: white;`}
  margin: 3px 0;
  padding: 10px;
  font-weight: 400;
  font-size: 13px;
  text-transform: uppercase;
  display: inline-flex;
  justify-content: center;
  align-items: center;
   &:hover {
    transition: all 0.6s ease-in-out;
    background-color: ${({ theme }) => theme.soft};
    color: white;
  }
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

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  margin: 10px 0;
`;

const AddForm = ({ setNewForm }) => {
  const [formName, setFormName] = useState("");
  const [sections, setSections] = useState([]);
  const { formId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getFormData = async () => {
      const response = await axios.get("/api/forms/" + formId);
      const { name, sections } = response.data;
      setFormName(name);
      setSections(sections);
    };
    if (formId) getFormData();
  }, [formId]);

  const handleAddSection = () => {
    const newSection = {
      name: "",
      form_fields: [],
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections.splice(sectionIndex, 1);
    setSections(updatedSections);
  };

  const handleSectionNameChange = (e, sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].name = e.target.value;
    setSections(updatedSections);
  };

  const handleFieldChange = (e, sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields[fieldIndex][e.target.name] =
      e.target.value;
    setSections(updatedSections);
  };

  const handleAddField = (sectionIndex) => {
    const newField = {
      label: "",
      field_type: "text",
      choices: [],
    };
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields.push(newField);
    setSections(updatedSections);
  };

  const handleDeleteField = (sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields.splice(fieldIndex, 1);
    setSections(updatedSections);
  };

  const handleAddOption = (sectionIndex, fieldIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields[fieldIndex].choices.push({});
    setSections(updatedSections);
  };

  const handleOptionChange = (e, sectionIndex, fieldIndex, optionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields[fieldIndex].choices[optionIndex] =
      { choice_text: e.target.value };
    setSections(updatedSections);
  };

  const handleDeleteOption = (sectionIndex, fieldIndex, optionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].form_fields[fieldIndex].choices.splice(
      optionIndex,
      1
    );
    setSections(updatedSections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formName,
      sections: sections
    };
    if(data.name != "" && data.sections != []) {
        console.log(data);
        setNewForm(false)
    }
    // Add axios request to save form data here
  };

  return (

    <Modal open={true}>
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
            onClick={() => setNewForm(false)}
            >
            <CloseRounded style={{ color: "inherit" }} />
            </IconButton>
            <Title>CREATE A NEW FORM</Title>

            <Label>Form Details :</Label>
      <OutlinedBox mb={3} style={{ marginBottom: '10px' }}>
        <TextInput
            placeholder="Form Name (Required)*"
          variant="outlined"
          fullWidth
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          
        />
      </OutlinedBox>
  
      <Box mb={3}>
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex} mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" paddingBottom='5px'>
              <Label>{`Section ${sectionIndex + 1}`}</Label>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteSection(sectionIndex)}
              >
                Delete Section
              </Button>
            </Box>
  
            <OutlinedBox mb={2}>
                <TextInput
                    placeholder={`Section ${sectionIndex + 1} Name`}
                    variant="outlined"
                    fullWidth
                    value={section.name}
                    onChange={(e) => handleSectionNameChange(e, sectionIndex)}
                    />
            </OutlinedBox>
  
            {section.form_fields.map((field, fieldIndex) => (
              <Box key={fieldIndex} mt={2} mb={2}>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <OutlinedBox mb={2}>
                    <TextInput
                        style={{ width: '300px' }}
                        placeholder="Field Label"
                        variant="outlined"
                        value={field.label}
                        onChange={(e) => handleFieldChange(e, sectionIndex, fieldIndex)}
                        name="label"
                    />
                  </OutlinedBox>
                  <OutlinedBox style={{ width: "100%" }}>
                    <select
                        id="field_type"
                        name="field_type"
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
                        value={field.field_type}
                        onChange={(e) => handleFieldChange(e, sectionIndex, fieldIndex)}
                    >
                    <option value="" disabled>
                      Select field type
                    </option>
                    <option value="text">Text</option>
                      <option value="password">Password</option>
                      <option value="radio">Radio</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="select">Select</option>
                  </select>
                </OutlinedBox>

                </Box>
  
                {["radio", "checkbox", "select"].includes(field.field_type) && (
                  <Box mt={2}>
                    {field.choices.map((option, optionIndex) => (
                      <Box key={optionIndex} display="flex" justifyContent="flex-start" gap={2} mb={2}>
                        <OutlinedBox>
                        <TextInput
                          placeholder="Option"
                          value={option.choice_text}
                          onChange={(e) => handleOptionChange(e, sectionIndex, fieldIndex, optionIndex)}
                        
                        />
                        </OutlinedBox>
                        <OutlinedButton style={{ backgroundColor: '#d32f2f' }}  variant="contained" color="error" onClick={() => handleDeleteOption(sectionIndex, fieldIndex, optionIndex)}>
                          Delete Option
                        </OutlinedButton>
                      </Box>
                    ))}
  
                    <OutlinedButton style={{ backgroundColor: 'rgb(230 141 76)' }} variant="outlined" color="primary" onClick={() => handleAddOption(sectionIndex, fieldIndex)}>
                        Add Option
                    </OutlinedButton>
                  </Box>
                )}
  
                <OutlinedButton style={{ backgroundColor: '#d32f2f' }} sx={{ mt: "10px" }} variant="contained" color="error" onClick={() => handleDeleteField(sectionIndex, fieldIndex)}>
                  Delete Label
                </OutlinedButton>
              </Box>
            ))}
  
            <OutlinedButton style={{ backgroundColor: 'rgb(76 129 230)' }} sx={{ margin: "10px 0" }} variant="outlined" color="primary" onClick={() => handleAddField(sectionIndex)}>
              Add Field
            </OutlinedButton>
          </Box>
        ))}
  
        <OutlinedButton style={{ backgroundColor: 'yellowgreen' }} variant="outlined" color="primary" onClick={handleAddSection}>
          Add Section
        </OutlinedButton>
      </Box>
  
      <OutlinedButton style={{ backgroundColor: '#854CE6', textAlign: 'center' }} variant="contained" color="primary" type="submit" onClick={handleSubmit}>
        {formId ? "Update Form" : "Create Form"}
      </OutlinedButton>
            </Wrapper>
        </Container>
    </Modal>
  
  );
};

export default AddForm;
