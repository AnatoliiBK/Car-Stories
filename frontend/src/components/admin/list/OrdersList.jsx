import styled from "styled-components";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ordersEdit, ordersFetch } from "../../../slices/ordersSlice";
import moment from "moment";

export default function OrdersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ordersList } = useSelector((state) => state.orders);

  React.useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const rows = ordersList && ordersList.map((order) => ({
    id: order._id,
    cName: order.shipping.name,
    amount: (order.total / 100)?.toLocaleString(),
    dStatus: order.delivery_status,
    date: moment(order.createdAt).fromNow(),
  }));

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {rows && rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell><strong>ID:</strong>
            <div>
              {row.id}
          </div>
          </TableCell>
          <TableCell><strong>Name:</strong>
            <div>
              {row.cName}
          </div>
          </TableCell>
          <TableCell><strong>Amount:</strong>
          <div>{row.amount}</div>
          </TableCell>
          <TableCell><strong>Status:</strong> 
            <Status>
              {row.dStatus === "pending" ? (
                <Pending>Pending</Pending>
              ) : row.dStatus === "dispatched" ? (
                <Dispatched>Dispatched</Dispatched>
              ) : row.dStatus === "delivered" ? (
                <Delivered>Delivered</Delivered>
              ) : (
                "error"
              )}
            </Status>
          </TableCell>
          <TableCell><strong>Date:</strong>
            <div>
              {row.date}
          </div>
          </TableCell>
          <TableCell><strong>Actions:</strong>
            <Actions>
              <DispatchBtn onClick={() => handleOrderDispatch(row.id)}>
                Dispatch
              </DispatchBtn>
              <DeliveryBtn onClick={() => handleOrderDeliver(row.id)}>
                Delivery
              </DeliveryBtn>
              <View onClick={() => navigate(`/order/${row.id}`)}>View</View>
            </Actions>
          </TableCell>
        </TableRow>
      ))}
    </div>
  );

  function handleOrderDispatch(id) {
    dispatch(ordersEdit({ id, delivery_status: "dispatched" }));
  }

  function handleOrderDeliver(id) {
    dispatch(ordersEdit({ id, delivery_status: "delivered" }));
  }
}

const DispatchBtn = styled.button`
  background-color: rgb(38, 198, 249);
  margin-right: 5px;
  @media(max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const DeliveryBtn = styled.button`
  background-color: rgb(102, 108, 255);
  margin-right: 5px;
  @media(max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
  @media(max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const Pending = styled.div`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media(max-width: 768px) {
    font-size: 12px;
    margin: 0;
  }
`;

const Dispatched = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media(max-width: 768px) {
    font-size: 12px;
  }
`;

const Delivered = styled.div`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media(max-width: 768px) {
    font-size: 12px;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  gap: 5px;
  button {
    border: none;
    outline: none;
    padding: 3px 10px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
  @media(max-width: 768px) {
    /* margin-left: 5rem; */
    flex: 0;
    height: auto;
    /* overflow-y: auto; */
  }
`;

const Status = styled.div`
  width: 100%;
  height: 32px;
  align-items: center;
  display: flex;
  @media(max-width: 768px) {
    /* margin-left: 5rem; */
    align-items: flex-start;
    height: auto;
    flex: 0;
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
