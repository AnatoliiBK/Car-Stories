import styled from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { productsDelete } from "../../../slices/productsSlice";
// import EditProduct from "../EditProduct";
import { userDelete, usersFetch } from "../../../slices/usersSlice";
// import { isAdmin } from "../../../../../backend/middleware/auth";

// наступні залежності встановлюються для використання функціоналу списку з сайту :
// https://mui.com/material-ui/getting-started/installation/
// npm i @mui/x-data-grid
// npm i @mui/material @emotion/react @emotion/styled

export default function UsersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { usersList } = useSelector((state) => state.users);

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

  const columns = [
    // { field: "id", headerName: "ID", width: 220 },
    { field: "id", headerName: "ID", flex: 0.5, },
    {
      field: "uName",
      headerName: "Name",
      flex: 0.5,
      // width: 150,
      //   renderCell: (params) => {
      //     return (
      //       <ImageContainer>
      //         <img src={params.row.imageUrl} alt="" />
      //       </ImageContainer>
      //     );
      //   },
    },
    { field: "uEmail", headerName: "Email", flex: 1, },
    // { field: "uEmail", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Role",
      flex: 0.4,
      // width: 100,
      renderCell: (params) => {
        return (
          <RoleContainer>
            {params.row.isAdmin ? (
              <Admin>Admin</Admin>
            ) : (
              <Customer>Customer</Customer>
            )}
          </RoleContainer>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      //   description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 0.5,
      // width: 120,
      //   valueGetter: (value, row) =>
      //     `${row.firstName || ""} ${row.lastName || ""}`,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
            <View onClick={() => navigate(`/user/${params.row.id}`)}>View</View>
          </Actions>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    dispatch(userDelete(id))
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

const RoleContainer = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  /* img {
    height: 40px;
  } */
`;

// const Actions = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 52px;
//   button {
//     border: none;
//     outline: none;
//     padding: 3px 5px;
//     color: white;
//     border-radius: 3px;
//     cursor: pointer;
//   }
// `;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Відстань між кнопками */
  height: 52px;

  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;


const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
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
`;