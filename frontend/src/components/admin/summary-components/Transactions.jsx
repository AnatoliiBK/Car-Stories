import { useEffect, useState } from "react";
import { url, setHeaders } from "../../../slices/api";
import axios from "axios";
import styled from "styled-components";
import moment from "moment";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const width = useWindowWidth();
  const isSmallScreen = width <= 768;

  // console.log("TRANSACTION ORDERS ; ", orders);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${url}/orders/?new=true`, setHeaders());

        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <StyledTransactions>
      {isLoading ? (
        <p>Transactions Loading...</p>
      ) : (
        <>
            <h3>{isSmallScreen ? "Latest Transactions" : "Latest Transactions"}</h3>
          {orders?.map((order, index) => (
            <Transaction key={index}>
              <p>{order.shipping.name}</p>
              <p>${(order.total / 100).toLocaleString()}</p>
              <p>{moment(order.createdAt).fromNow()}</p>
            </Transaction>
          ))}
        </>
      )}
    </StyledTransactions>
  );
};

export default Transactions;

const StyledTransactions = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  padding: 1rem;
  border-radius: 5px;
  h3 {
    text-align: center;
  }
`;

// const Transaction = styled.div`
//   display: flex;
//   font-size: 14px;
//   margin-top: 1rem;
//   padding: 0.5rem;
//   border-radius: 3px;
//   background: rgba(38, 198, 249, 0.12);
//   p {
//     flex: 1;
//   }
//   &:nth-child(even) {
//     background: rgba(102, 108, 255, 0.12);
//   }
// `;

const Transaction = styled.div`
  display: flex;
  flex-wrap: wrap; //автоматичне перенесення на новий рядок якщо не поміщається
  font-size: 14px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
  background: rgba(38, 198, 249, 0.12);
  
  p {
    flex: 1;
    text-align: center;
  }

  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }

  @media (max-width: 968px) {
    p:nth-child(3) {
      flex-basis: 100%;
      margin-top: 0.5rem;
    }
  }
   @media (max-width: 768px) {
    flex-wrap: nowrap;
    p:nth-child(3) {
      flex-basis: auto;
      margin-top: 0;
    }
  }
  @media(max-width: 425.98px) {
     
  }
`;

// p {
//       flex: 0 0 100%; /* Кожен параграф займає всю ширину */
//       margin-top: 0.5rem;
//     }

//     p:first-child {
//       margin-top: 0; /* Видалити верхній відступ для першого параграфа */
//     }