import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { FaUsers, FaStore, FaClipboard, FaTachometerAlt, FaCar } from "react-icons/fa"
import { useEffect, useState } from "react";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const Dashboard = () => {
  const auth = useSelector(state => state.auth)

  const width = useWindowWidth();
  const isSmallScreen = width <= 650;

  if (!auth.isAdmin) return <p>Acces Denied</p>
  
  return (
    <StyledDashboard>
      <SideNav>
        <h3>{isSmallScreen ? 'Links' : 'Quick Links'}</h3>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/pending"
        >
          <FaCar /> Recent Cars
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/summary"
        >
          <FaTachometerAlt /> Summary
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/all-cars"
        >
          <FaStore /> All Cars
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/orders"
        >
          <FaClipboard /> Orders
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/users"
        >
          <FaUsers /> Users
        </NavLink>
      </SideNav>
      <Content>
        <Outlet />
      </Content>
    </StyledDashboard>
  );
};

export default Dashboard;

const StyledDashboard = styled.div`
  display: flex;
  height: 100vh;
  @media (max-width: 425.98px) {
    flex-direction: column;
  }
`;

// Контейнер для бічної панелі
const SideNav = styled.div`
  border-right: 1px solid grey;
  height: calc(100vh - 70px);
  //position: fixed;
  /* overflow-y: auto; */
  width: 20%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  @media(max-width: 858px) {
    padding-right: 1rem;
    padding-left: 1rem;
    /* align-items: center; */
  }
  @media(max-width: 768px) {
    padding-right: 0.7rem;
    padding-left: 0.7rem;
  }
  @media (max-width: 425.98px) {
    border-right: none;
    border-bottom: 1px solid grey;
    height: auto;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }

  h3 {
    margin: 0 0 1rem 0;
    padding: 0;
    text-transform: uppercase;
    font-size: 17px;
  }

  a {
    text-decoration: none;
    margin-bottom: 1rem;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: 700;

    svg {
      margin-right: 0.5rem;
      font-size: 18px;
      @media (max-width: 650.98px) {
        display: none;
      }
    }
  }
`;

// Контейнер для статистики і для списків продуктів, замовлень, користувачів
const Content = styled.div`
  /* margin-left: 200px; */
  padding: 2rem 0;
  width: 80%;
  @media (max-width: 988px) {
    padding-right: 2px;
  }
  @media(max-width: 425.98px) {
    width: 100%;
  }
`;
