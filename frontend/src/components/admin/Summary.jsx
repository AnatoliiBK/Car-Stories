import styled from "styled-components";
import { useEffect, useState } from "react";
import { FaUsers, FaClipboard, FaChartBar } from "react-icons/fa";
import Widget from "./summary-components/Widget";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import Chart from "./summary-components/Chart";
import Transactions from "./summary-components/Transactions";
import AllTimeData from "./summary-components/AllTimeData";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const Summary = () => {
  const [users, setUsers] = useState([]);
  const [usersPerc, setUsersPerc] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersPerc, setOrdersPerc] = useState(0);
  const [income, setIncome] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);

  const width = useWindowWidth();
  const isSmallScreen = width <= 768;

  // console.log("USERS : ", users);
  // console.log("USERS PERC : ", usersPerc);
  // console.log("ORDERS : ", orders);
  // console.log("ORDRERS PERC : ", ordersPerc);
  // console.log("INCOME : ", income);
  // console.log("INCOME PERC : ", incomePerc);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1;
    }
    if (a._id > b._id) {
      return -1;
    }
    return;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders());

        res.data.sort(compare);
        // console.log("STATS RES.DATA : ", res.data);

        setUsers(res.data);
        setUsersPerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders());

        res.data.sort(compare);
        // console.log("STATS RES.DATA : ", res.data)

        setOrders(res.data);
        setOrdersPerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  // income (дохід з різних джерел)    earnings (заробіток або зарплата)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/income/stats`, setHeaders());

        res.data.sort(compare);
        console.log("STATS RES.DATA : ", res.data)

        setIncome(res.data);
        setIncomePerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const dataWidget = [
    {
      icon: <FaUsers />,
      digits: users[0]?.total,
      isMoney: false,
      title: "Users",
      color: "rgb(102, 108, 255)",
      bgColor: "rgba(102, 108, 255, 0.12)",
      percentage: usersPerc,
    },
    {
      icon: <FaClipboard />,
      digits: orders[0]?.total,
      isMoney: false,
      title: "Orders",
      color: "rgb(38, 198, 249)",
      bgColor: "rgba(38, 198, 249, 0.12)",
      percentage: ordersPerc,
    },
    {
      icon: <FaChartBar />,
      digits: income[0]?.total ? income[0]?.total / 100 : "",
      isMoney: true,
      title: "Earnings",   // заробіток
      color: "rgb(253, 181, 40)",
      bgColor: "rgba(253, 181, 40, 0.12)",
      percentage: incomePerc,
    },
  ];

  return (
    <StyledSummary>
      <MainStats>
        <Overview>
          <Title>
            <h2>Overview</h2>
            <p>{isSmallScreen ? "Compared to the previous month" : "How you shop is performing compared to the previous month"}</p>
          </Title>
          <WidgetWrapper>
            {dataWidget?.map((el, index) => {
              // console.log("EL : ", el);
              return <Widget key={index} data={el} />;
            })}
          </WidgetWrapper>
        </Overview>
        <Chart />
      </MainStats>
      <SiteStats>
        <Transactions />
        <AllTimeData />
      </SiteStats>
    </StyledSummary>
  );
};

export default Summary;

const StyledSummary = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding-right:5px;
  @media(max-width: 768.98px) {
    flex-direction: column;
    padding-left: 5px;
  }
`;

const MainStats = styled.div`
  flex: 2;
  width: 80%;
  @media(max-width: 768.98px) {
    width: 100%;
  }
`;

const Title = styled.div`
  p {
    font-size: 14px;
    color: rgba(234, 234, 255, 0.68);
  }
`;

const Overview = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  width: 100%;
  padding: 1.5rem;
  height: 170px;
  border: none;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media(max-width: 768px) {
    height: 240px;
  }
`;

const WidgetWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const SiteStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* margin-left: 2rem; */
  width: 20%;
  @media(max-width: 768.98px) {
    width: 100%;
    margin-top: 2rem;
  }
`;
