import styled, { keyframes } from "styled-components";
// import styled from "styled-components";

const colorChange = keyframes`
  0% {
    color: yellow;
  }

  100% {
    color: green;
  }
`;

export const AdminHeaders = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  animation: ${colorChange} 1s infinite alternate;
`;

export const PrimaryButton = styled.button`
  padding: 9px 12px;
  border-radius: 5px;
  font-weight: 400;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0.5rem;
  &:focus {
    /* border: 2px solid rgb(0, 208, 255); */
    transform: scale(1.03);
    background-color: blue;
  }
  &:hover {
    /* border: 2px solid rgb(0, 208, 255); */
    transform: scale(1.03);
    background-color: blue;
  }
`;

export const CancelButton = styled.button`
  text-transform: uppercase;
  padding: 8px;
  /* border-radius: 5px; */
  font-weight: 400;
  /* letter-spacing: 1.15px; */
  /* background-color: gray; */
  background: none;
  /* color: #f9f9f9; */
  color: #1976d2;
  border: none;
  outline: none;
  cursor: pointer;
  /* margin: 0.5rem; */
  margin-top: 0.5rem;
  margin-left: auto;
  &:focus {
    transform: scale(1.05);
    color: blue;
  }
  &:hover {
    transform: scale(1.05);
    color: blue;
  }
`;
