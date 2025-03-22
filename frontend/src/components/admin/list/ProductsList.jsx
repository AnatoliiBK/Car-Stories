import styled from "styled-components";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productsDelete } from "../../../slices/productsSlice";
import EditProduct from "../EditProduct";
import { Dropdown, DropdownButton, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../ThemeContext"


export default function ProductsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { productsList } = useSelector((state) => state.products);

  const rows =
    productsList &&
    productsList.map((product) => {
      return {
        id: product._id,
        imageUrl: product.image.url,
        pName: product.name,
        pDesc: product.desc,
        price: product.price.toLocaleString(),
      };
    });

  // const handleDelete = (id) => {
  //   dispatch(productsDelete(id));
  // };

  const [showModal, setShowModal] = React.useState(false);
  const [productIdToDelete, setProductIdToDelete] = React.useState(null);

  const handleShowModal = (id) => {
    setProductIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    dispatch(productsDelete(productIdToDelete));
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
              <strong>Image:</strong>
              <ImageContainer>
                <img src={row.imageUrl} alt="" />
              </ImageContainer>
            </TableCell>
            <TableCell>
              <strong>Name:</strong>
              <div>{row.pName}</div>
            </TableCell>
            <TableCell>
              <strong>Description:</strong>
              <div>{row.pDesc}</div>
            </TableCell>
            <TableCell>
              <strong>Price:</strong>
              <div>{row.price}</div>
            </TableCell>
            <TableCell>
              <strong>Actions:</strong>
              {/* <Actions>
                <View onClick={() => navigate(`/product/${row.id}`)}>View</View>
                <EditProduct prodId={row.id} />
                <Delete onClick={() => handleDelete(row.id)}>Delete</Delete>
              </Actions> */}
              <DropdownButton id="dropdown-basic-button" title="Select Action">
                <Dropdown.Item onClick={() => navigate(`/product/${row.id}`)}>
                  <View>View</View>
                </Dropdown.Item>
                <Dropdown.Item as="div">
                  <EditProduct prodId={row.id} />
                </Dropdown.Item>
                {/* <Dropdown.Item onClick={() => handleDelete(row.id)}>
                  <Delete>Delete</Delete>
                </Dropdown.Item> */}
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

const ImageContainer = styled.div`
  /* height: 52px; */
  display: flex;
  align-items: center;
  img {
    height: 40px;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
    color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  }
`;

// const Actions = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   /* height: 52px; */
//   @media (max-with: 768.98px) {
//     justify-content: space-around;
//   }
//   button {
//     border: none;
//     outline: none;
//     padding: 3px 5px;
//     color: white;
//     border-radius: 3px;
//     cursor: pointer;
//   }
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

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  box-sizing: border-box; // враховує padding та border в ширині контейнера
  overflow: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TableCell = styled.div`
  padding: 10px;
  flex: 1;
  white-space: nowrap; // запобігає переносу тексту на новий рядок
  text-overflow: ellipsis; // додає три крапки в кінці обрізаного тексту

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    border-bottom: 1px solid #ccc;
  }
`;

// const Actions = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   /* height: 52px; */
//   @media (max-with: 768.98px) {
//     justify-content: space-around;
//   }
//   button {
//     border: none;
//     outline: none;
//     padding: 3px 5px;
//     color: white;
//     border-radius: 3px;
//     cursor: pointer;
//   }
// `;

// const Delete = styled.button`
//   background-color: rgb(255, 77, 73);
// `;

// const View = styled.button`
//   background-color: rgb(114, 225, 40);
// `;