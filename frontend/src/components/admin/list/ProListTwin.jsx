// import styled from "styled-components";
// import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { productsDelete } from "../../../slices/productsSlice";
// import EditProduct from "../EditProduct";

// // наступні залежності встановлюються для використання функціоналу списку з сайту :
// // https://mui.com/material-ui/getting-started/installation/
// // npm i @mui/x-data-grid
// // npm i @mui/material @emotion/react @emotion/styled

// export default function ProductsList() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
  
//   const { productsList } = useSelector((state) => state.products);

//   const rows =
//     productsList &&
//     productsList.map((item) => {
//       return {
//         id: item._id,
//         imageUrl: item.image.url,
//         pName: item.name,
//         pDesc: item.desc,
//         price: item.price.toLocaleString(),
//       };
//     });

//   const columns = [
//     { field: "id", headerName: "ID", flex: 0.5 },
//     {
//       field: "imageUrl",
//       headerName: "Image",
//       // width: 80,
//       flex: 0.3,
//       renderCell: (params) => {
//         return (
//           <ImageContainer>
//             <img src={params.row.imageUrl} alt="" />
//           </ImageContainer>
//         );
//       },
//     },
//     { field: "pName", headerName: "Name", flex: 0.5 }, //width: 130
//     {
//       field: "pDesc",
//       headerName: "Description",
//       flex: 0.5,
//       // width: 130,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       // width: 80,
//       flex: 0.5
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       //   description: "This column has a value getter and is not sortable.",
//       sortable: false,
//       flex: 1,
//       // width: 170,
//       //   valueGetter: (value, row) =>
//       //     `${row.firstName || ""} ${row.lastName || ""}`,
//       renderCell: (params) => {
//         return (
//           <Actions>
//             <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
//             <EditProduct prodId={params.row.id} />
//             <View onClick={() => navigate(`/product/${params.row.id}`)}>View</View>
//           </Actions>
//         );
//       },
//     },
//   ];

//   const handleDelete = (id) => {
//     dispatch(productsDelete(id))
//   }

//   return (
//     <div style={{ height: 400, width: "100%" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         disableRowSelectionOnClick
//       />
//     </div>
//   );
// }

// const ImageContainer = styled.div`
//   height: 52px;
//   display: flex;
//   align-items: center;
//   img {
//     height: 40px;
//   }
// `;

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

// const Delete = styled.button`
//   background-color: rgb(255, 77, 73);
// `;

// const View = styled.button`
//   background-color: rgb(114, 225, 40);
// `;

