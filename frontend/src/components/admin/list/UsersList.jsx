import styled from "styled-components";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userDelete, usersFetch } from "../../../slices/usersSlice";
import { Dropdown, DropdownButton, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../ThemeContext"


export default function UsersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { usersList } = useSelector((state) => state.users);
  console.log("userList In USER LIST", usersList)

  React.useEffect(() => {
    dispatch(usersFetch());
  }, [dispatch]);

  const rows =
    usersList &&
    usersList.map((user) => {
      return {
        id: user._id,
        uName: user.name,
        uEmail: user.email,
        isAdmin: user.isAdmin,
      };
    });



  // const handleDelete = (id) => {
  //   dispatch(userDelete(id));
  // };
  const [showModal, setShowModal] = React.useState(false);
  const [userIdToDelete, setUserIdToDelete] = React.useState(null);

  const handleShowModal = (id) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    dispatch(userDelete(userIdToDelete));
    handleCloseModal();
  };

return (
  <div style={{ width: "100%", overflow: "auto" }}>
    {rows &&
      rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell>
            <strong>ID:</strong>
            <div>{row.id}</div>
          </TableCell>
          <TableCell>
            <strong>Name:</strong>
            <div>{row.uName}</div>
          </TableCell>
          <TableCell>
            <strong>Email:</strong>
            <div>{row.uEmail}</div>
          </TableCell>
          <TableCell>
            <strong>Role:</strong>
            <RoleContainer>
              {row.isAdmin ? (
                <Admin>Admin</Admin>
              ) : (
                <Customer>Customer</Customer>
              )}
            </RoleContainer>
          </TableCell>
          <TableCell>
            <strong>Actions:</strong>
            {/* <Actions>
              <Delete onClick={() => handleDelete(row.id)}>Delete</Delete>
              <View onClick={() => navigate(`/user/${row.id}`)}>View</View>
            </Actions> */}
            <DropdownButton id="dropdown-basic-button" title="Select Action">
                <Dropdown.Item onClick={() => navigate(`/user/${row.id}`)}>
                  <View>View & Edit</View>
                </Dropdown.Item>
                
                
                <Dropdown.Item onClick={() => handleShowModal(row.id)}>
                  <Delete>Delete</Delete>
                </Dropdown.Item>
              </DropdownButton>
          </TableCell>
        </TableRow>
      ))}
    
    <StyledModal show={showModal} onHide={handleCloseModal}theme={theme}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </StyledModal>
  </div>
);
}

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
    color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  }
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  box-sizing: border-box; // враховує padding та border в ширині контейнера
  overflow: auto;

  @media(max-width: 768px) {
    flex-direction: column;
  }
`;

const TableCell = styled.div`
  padding: 10px;
  flex: 1;
  white-space: nowrap; // запобігає переносу тексту на новий рядок
  text-overflow: ellipsis; // додає три крапки в кінці обрізаного тексту

  @media(max-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    border-bottom: 1px solid #ccc;
  }
`;


const RoleContainer = styled.div`
  /* height: 52px; */
  display: flex;
  align-items: center;
  /* img {
    height: 40px;
  } */
`;


const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Відстань між кнопками */
  /* height: 52px; */

  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

// const Delete = styled.button`
//   background-color: rgb(255, 77, 73);
// `;

// const View = styled.button`
//   background-color: rgb(114, 225, 40);
// `;

const Delete = styled.div`
  /* background-color: rgb(255, 77, 73); */
  background-color: #b33333;
  color: white;
  text-align: center;
  border-radius: 3px;
  &:focus {
    background-color: red;
  }
  &:hover {
    background-color: red;
  }
`;

const View = styled.div`
  background-color: #4c8c56;
  color: white;
  text-align: center;
  border-radius: 3px;
  &:focus {
    background-color: rgb(114, 225, 40);
  }
  &:hover {
    background-color: rgb(114, 225, 40);
  }
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 10px 0px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  @media(max-width: 768.98px) {
    padding-right: 20px;
    padding-left: 20px;
  }
`;

const Customer = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 10px 0px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  @media(max-width: 768.98px) {
    padding-right: 20px;
    padding-left: 20px;
  }
`;

