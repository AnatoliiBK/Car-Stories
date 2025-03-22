import styled from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { ordersDelete } from "../../../slices/ordersSlice";
// import EditProduct from "../EditProduct";
import { ordersEdit, ordersFetch } from "../../../slices/ordersSlice";
import moment from "moment";

// наступні залежності встановлюються для використання функціоналу списку з сайту :
// https://mui.com/material-ui/getting-started/installation/
// npm i @mui/x-data-grid
// npm i @mui/material @emotion/react @emotion/styled

export default function OrdersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ordersList } = useSelector((state) => state.orders);

  // console.log("ordersList : ", ordersList);

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const rows =
    ordersList &&
    ordersList.map((order) => {
      return {
        id: order._id,
        cName: order.shipping.name,
        amount: (order.total / 100)?.toLocaleString(),
        dStatus: order.delivery_status,
        date: moment(order.createdAt).fromNow(),
      };
    });

  // Перевіряємо, чи є список визначеним, та формуємо ряди для таблиці
  // const rows = ordersList ? ordersList.map((order) => ({
  //   id: order._id,
  //   cName: order.sipping.name,
  //   amount: (order.total / 100)?.toLocaleString(),
  //   dStatus: order.delivery_status,
  //   date: moment(order.createdAt).fromNow(),
  // })) : [];

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "cName",
      headerName: "Name",
      flex: 0.5
      // width: 120,
    },
    { field: "amount", headerName: "Amount($)", flex: 0.5 }, //width: 100
    {
      field: "dStatus",
      headerName: "Status",
      flex: 0.5,
      // width: 100,
      renderCell: (params) => {
        return (
          <Status>
            {params.row.dStatus === "pending" ? (
              <Pending>Pending</Pending>
            ) : params.row.dStatus === "dispatched" ? (
              <Dispatched>Dispatched</Dispatched>
            ) : params.row.dStatus === "delivered" ? (
              <Delivered>Delivered</Delivered>
            ) : (
              "error"
            )}
          </Status>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.5
      // width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      //   description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 1,
      // width: 220,
      //   valueGetter: (value, row) =>
      //     `${row.firstName || ""} ${row.lastName || ""}`,
      renderCell: (params) => {
        // console.log("PARAMS", params)
        return (
          <Actions>
            <DispatchBtn onClick={() => handleOrderDispatch(params.row.id)}>
              Dispatch
            </DispatchBtn>
            <DeliveryBtn onClick={() => handleOrderDeliver(params.row.id)}>
              Delivery
            </DeliveryBtn>
            <View onClick={() => navigate(`/order/${params.row.id}`)}>View</View>
          </Actions>
        );
      },
    },
  ];

  const handleOrderDispatch = (id) => {
    dispatch(
      ordersEdit({
        id,
        delivery_status: "dispatched",
      })
    );
    // dispatch(ordersFetch()); // Оновлення списку після зміни статусу
  };

  const handleOrderDeliver = (id) => {
    dispatch(
      ordersEdit({
        id,
        delivery_status: "delivered",
      })
    );
    // dispatch(ordersFetch()); // Оновлення списку після зміни статусу
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

const DispatchBtn = styled.button`
  background-color: rgb(38, 198, 249);
   @media(max-width: 860px) {
    padding: 2px 4px;
    font-size: 12px;
  }
  @media(max-width: 806px) {
    padding: 2px 4px;
    font-size: 10px;
  }
`;

const DeliveryBtn = styled.button`
  background-color: rgb(102, 108, 255);
   @media(max-width: 860px) {
    padding: 2px 4px;
    font-size: 12px;
  }
   @media(max-width: 806px) {
    padding: 2px 4px;
    font-size: 10px;
  }
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
   @media(max-width: 860px) {
    padding: 2px 4px;
    font-size: 12px;
  }
  @media(max-width: 806px) {
    padding: 2px 4px;
    font-size: 10px;
  }
`;

const Pending = styled.div`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 4px 4px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  overflow: hidden; // Забезпечує обрізання вмісту, що не вміщається
  text-overflow: ellipsis; // Додає три крапки в кінці обрізаного тексту
  white-space: nowrap; // Забезпечує відображення тексту в одному рядку
  @media(max-width: 768px) {
    padding: 4px 4px;
    font-size: 12px;
  }
`;

const Dispatched = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 4px 4px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  overflow: hidden; // Забезпечує обрізання вмісту, що не вміщається
  text-overflow: ellipsis; // Додає три крапки в кінці обрізаного тексту
  white-space: nowrap; // Забезпечує відображення тексту в одному рядку
   @media(max-width: 768px) {
    /* padding: 4px 4px; */
    font-size: 12px;
  }
`;

const Delivered = styled.div`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 4px 4px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  overflow: hidden; // Забезпечує обрізання вмісту, що не вміщається
  text-overflow: ellipsis; // Додає три крапки в кінці обрізаного тексту
  white-space: nowrap; // Забезпечує відображення тексту в одному рядку
   @media(max-width: 768px) {
    /* padding: 4px 4px; */
    font-size: 12px;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  gap: 5px;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
  @media(max-width: 818px) {
    flex-direction: row; // залишаємо горизонтальну орієнтацію
    gap: 5px; // додаємо проміжок між кнопками
  }
  @media(max-width: 768px) { // змінюємо поріг
    flex-direction: column;
    height: 50px; /* Фіксована висота для прокручування */
    overflow-y: auto; /* Додаємо вертикальний скролінг */
  }
`;

const Status = styled.div`
  width: 100%;
  height: 52px;
  align-items: center;
  display: flex;
`;

// const Dispatched = styled.div`
//   color: rgb(38, 198, 249);
//   background-color: rgba(38, 198, 249, 0.12);
//   padding: 3px 5px;
//   border-radius: 3px;
//   font-size: 14px;
// `;

// const Delivered = styled.div`
//   color: rgb(102, 108, 255);
//   background-color: rgba(102, 108, 255, 0.12);
//   padding: 3px 5px;
//   border-radius: 3px;
//   font-size: 14px;
// `;