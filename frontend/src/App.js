import "./App.css";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./slices/authSlice";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import Details from "./components/Details";
import NavBar from "./components/NavBar";
import Header from "./components/Header"; // Імпортуємо Header
import Home from "./components/Home";
import Cart from "./components/Cart";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import CheckoutSuccess from "./components/CheckoutSuccess";
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/AllCars";
import Summary from "./components/admin/Summary";
import CreateProduct from "./components/admin/CreateProduct";
import ProductsList from "./components/admin/list/ProductsList";
import Users from "./components/admin/Users";
import Orders from "./components/admin/Orders";
import Product from "./components/details/Product";
import Order from "./components/details/Order";
import UserProfile from "./components/details/UserProfile";
import Favorites from "./components/Favorites";
import NotFound from "./components/NotFound";

import CarList from "./components/CarList";
import CarDetails from "./components/CarDetails";
import RecentlyAddedCars from "./components/RecentlyAddedCars";
import AdminPanel from "./components/AdminPanel";
import AddCarIndicator from "./components/AddCarIndicator";
import ClassicCarList from "./components/ClassicCarList";
import AllCars from "./components/admin/AllCars";
import AddCarForm from "./components/AddCarForm";
import ViewedCars from "./components/ViewedCars";
import CarSpecsPage from "./components/CarSpecsPage";
import AddCarSpecs from "./components/AddCarSpecs";
import EditCarPage from "./components/EditCarPage";
import EditCarSpecsPage from "./components/EditCarSpecsPage";
import MyCarsList from "./components/MyCarsList";
import CarSearchBar from "./components/CarSearchBar";
import FilteredCarsPage from "./components/FilteredCarsPage";
import PermissionRequestsPage from "./components/PermissionRequestsPage";
import PermissionResponsePage from "./components/PermissionResponsePage";

const AppContent = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const nodeRef = useRef(null); // Додаємо реф для CSSTransition
  const user = useSelector((state) => state.auth._id);

  useEffect(() => {
    document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  }, [theme]);

  useEffect(() => {
    dispatch(loadUser(null));
  }, [dispatch]);

  // Відстеження зміни стану користувача
  useEffect(() => {
    // Цей ефект спрацьовує при кожній зміні user
    if (!user) {
      console.log("Користувач вийшов, RecentlyAddedCars не рендериться");
      // Додаткова логіка, якщо потрібно (наприклад, очищення даних)
    } else {
      console.log("Користувач авторизований, RecentlyAddedCars рендериться");
    }
  }, [user]); // Залежність від user забезпечує миттєву реакцію

  return (
    <div className="App">
      <ToastContainer />
      <NavBar />
      <Header />

      {/* <RecentlyAddedCars /> */}
      {user && <RecentlyAddedCars />}
      {/* {user && <CarSearchBar />} */}
      <div className="content-container">
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={500}
            // classNames="fade"
            classNames="slide"
            nodeRef={nodeRef} // Передаємо реф в CSSTransition
          >
            <div ref={nodeRef}>
              {" "}
              {/* Додаємо ref до обгорнутого елемента */}
              <Routes location={location}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/cars" element={<CarList />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/car-specs/:carId" element={<CarSpecsPage />} />
                <Route path="/add-car-specs/:carId" element={<AddCarSpecs />} />
                <Route
                  path="/car-specs/edit/:carId"
                  element={<EditCarSpecsPage />}
                />

                <Route path="/cars/edit/:id" element={<EditCarPage />} />
                <Route
                  path="/my-requests"
                  element={<PermissionRequestsPage />}
                />
                <Route
                  path="/permission-response"
                  element={<PermissionResponsePage />}
                />

                <Route path="/home" element={<Home />} />
                <Route path="/details" element={<Details />} />

                <Route path="classic-cars" element={<ClassicCarList />} />
                <Route path="/filtered-cars" element={<FilteredCarsPage />} />

                {/* <Route path="recently-cars" element={<RecentlyAddedCars />} /> */}
                {/* <Route
                  path="recently-cars"
                  element={user && <RecentlyAddedCars />}
                /> */}
                <Route path="/viewed-cars" element={<ViewedCars />} />
                <Route path="/my-cars" element={<MyCarsList />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/order/:id" element={<Order />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/admin" element={<Dashboard />}>
                  <Route path="all-cars" element={<AllCars />}>
                    <Route index element={<CarList />} />
                    <Route path="create" element={<AddCarForm />} />
                  </Route>
                  <Route path="pending" element={<AdminPanel />} />
                  <Route path="summary" element={<Summary />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="users" element={<Users />} />
                </Route>
                <Route path="*" element={<NotFound />} />
                {/* <Route path="/pending" element={<AdminPanel />} /> */}
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <AddCarIndicator />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;

// App Без плавності переходів

// import "./App.css";
// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loadUser } from "./slices/authSlice";
// import { ThemeProvider, useTheme } from "./components/ThemeContext";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import NavBar from "./components/NavBar";
// import Home from "./components/Home";
// import Cart from "./components/Cart";
// import Register from "./components/auth/Register";
// import Login from "./components/auth/Login";
// import CheckoutSuccess from "./components/CheckoutSuccess";
// import Dashboard from "./components/admin/Dashboard";
// import Products from "./components/admin/Products";
// import Summary from "./components/admin/Summary";
// import CreateProduct from "./components/admin/CreateProduct";
// import ProductsList from "./components/admin/list/ProductsList";
// import Users from "./components/admin/Users";
// import Orders from "./components/admin/Orders";
// import Product from "./components/details/Product";
// import Order from "./components/details/Order";
// import UserProfile from "./components/details/UserProfile";
// import Favorites from "./components/Favorites";
// import NotFound from "./components/NotFound";

// const AppContent = () => {
//   const { theme, toggleTheme } = useTheme();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     document.body.className = theme === "light" ? "light-theme" : "dark-theme";
//   }, [theme]);

//   useEffect(() => {
//     dispatch(loadUser(null));
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <ToastContainer />
//         <NavBar />
//         <div className="content-container">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/checkout-success" element={<CheckoutSuccess />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/product/:id" element={<Product />} />
//             <Route path="/favorites" element={<Favorites />} />
//             <Route path="/order/:id" element={<Order />} />
//             <Route path="/user/:id" element={<UserProfile />} />
//             <Route path="/admin" element={<Dashboard />}>
//               <Route path="products" element={<Products />}>
//                 <Route index element={<ProductsList />} />
//                 <Route path="create-product" element={<CreateProduct />} />
//               </Route>
//               <Route path="summary" element={<Summary />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="users" element={<Users />} />
//             </Route>
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// };

// const App = () => (
//   <ThemeProvider>
//     <AppContent />
//   </ThemeProvider>
// );

// export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";

// import Home from "./components/Home";
// import NavBar from "./components/NavBar";
// import NotFound from "./components/NotFound";
// import Cart from "./components/Cart";

// import "react-toastify/dist/ReactToastify.css";
// import Register from "./components/auth/Register";
// import Login from "./components/auth/Login";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loadUser } from "./slices/authSlice";
// import CheckoutSuccess from "./components/CheckoutSuccess";
// import Dashboard from "./components/admin/Dashboard";
// import Products from "./components/admin/Products";
// import Summary from "./components/admin/Summary";
// import CreateProduct from "./components/admin/CreateProduct";
// import ProductsList from "./components/admin/list/ProductsList";
// import Users from "./components/admin/Users";
// import Orders from "./components/admin/Orders";
// import Product from "./components/details/Product";
// import Order from "./components/details/Order";
// import UserProfile from "./components/details/UserProfile";
// import Favorites from "./components/Favorites";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(loadUser(null));
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <ToastContainer />
//         <NavBar />
//         <div className="content-container">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/checkout-success" element={<CheckoutSuccess />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/product/:id" element={<Product />} />
//             <Route path="/favorites" element={<Favorites />} />
//             <Route path="/order/:id" element={<Order />} />
//             <Route path="/user/:id" element={<UserProfile />} />
//             <Route path="/admin" element={<Dashboard />}>
//               <Route path="products" element={<Products />}>
//                 <Route index element={<ProductsList />} />
//                 <Route path="create-product" element={<CreateProduct />} />
//               </Route>
//               <Route path="summary" element={<Summary />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="users" element={<Users />} />
//             </Route>
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
