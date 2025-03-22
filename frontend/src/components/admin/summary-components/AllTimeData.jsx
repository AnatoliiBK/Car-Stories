import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ordersFetch } from "../../../slices/ordersSlice";
import { productsFetch } from "../../../slices/productsSlice";
import { usersFetch } from "../../../slices/usersSlice";

const AllTimeData = () => {
  const { productsList } = useSelector((state) => state.products);
  const { ordersList } = useSelector((state) => state.orders);
  const { usersList } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  //   const productsList = useSelector((state) => state.products.productsList);
  //   const ordersList = useSelector((state) => state.orders.ordersList);
  //   const usersList = useSelector((state) => state.users.usersList);

  // Обчислення загальної суми total в центах
  //   const totalEarnings = ordersList.reduce((acc, order) => acc + order.total, 0);

  useEffect(() => {
    // Перевіряємо, чи дані вже завантажені
    if (productsList.length === 0) dispatch(productsFetch());
    if (ordersList.length === 0) dispatch(ordersFetch());
    if (usersList.length === 0) dispatch(usersFetch());
  }, [dispatch, productsList.length, ordersList.length, usersList.length]);

  // Обчислення загальної суми total і перетворення на долари
  const totalEarnings =
    ordersList.reduce((acc, order) => acc + order.total, 0) / 100;

  // console.log("PRODUCTS LIST", productsList);
  // console.log("ORDERS LIST", ordersList);
  // console.log("USERSS LIST", usersList);
  // console.log("TOTAL EARNINGS", totalEarnings);
  return (
    <Main>
      <h3>All Time</h3>
      <Info>
        <Title>Users</Title>
        <Data>{usersList.length}</Data>
      </Info>
      <Info>
        <Title>Orders</Title>
        <Data>{ordersList.length}</Data>
      </Info>
      <Info>
        <Title>Products</Title>
        <Data>{productsList.length}</Data>
      </Info>
      <Info>
        <Title>Earnings</Title>
        <Data>$ {totalEarnings.toFixed(2)}</Data>
      </Info>
    </Main>
  );
};

export default AllTimeData;

const Main = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  margin-top: 1.5rem;
  border-radius: 5px;
  padding: 1rem;
  font-size: 14px;
  text-align: center;
`;

const Info = styled.div`
  display: flex;
  margin-top: 1rem;
  padding: 0.3rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);
  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }
  @media (max-width: 818px) {
    &:nth-child(5) {
      flex-direction: column; /* Розміщення компонентів один під одним для п'ятого блоку */
      align-items: center; /* Центрування компонентів по горизонталі */
    }
  }
  @media(max-width: 768.98px) {
     &:nth-child(5) {
      flex-direction: row;
     }
  }
`;

const Title = styled.div`
  flex: 1;
`;

const Data = styled.div`
  flex: 1;
  font-weight: 700;
  @media (max-width: 818px) {
    &:nth-child(5) {
      margin-top: 0.5rem; /* Відступ зверху для компонента Data в п'ятому блоці */
    }
  }
`;
