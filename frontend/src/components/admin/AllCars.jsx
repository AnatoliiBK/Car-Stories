import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";

const AllCars = () => {
    const navigate = useNavigate()
    const location = useLocation();

    // Перевірка, чи знаходиться поточний маршрут на "/admin/cars/create-car"
    const isAllCars = location.pathname === "/admin/all-cars/create";
    
    return (
        <>
            {/* <AdminHeaders>
                Products
                <PrimaryButton onClick={() => navigate("/admin/products/create-product")}>
                Create
                </PrimaryButton>
            </AdminHeaders> */}
            {!isAllCars && (
                <AdminHeaders>
                    All Cars
                    <PrimaryButton onClick={() => navigate("/admin/all-cars/create")}>
                        Create
                    </PrimaryButton>
                </AdminHeaders>
            )}
            <Outlet />
        </>
        
        
    );
    
}
 
export default AllCars;

// const Products = () => {
//     const navigate = useNavigate()
//     const location = useLocation();

//     // Перевірка, чи знаходиться поточний маршрут на "/admin/products/create-product"
//     const isCreatingProduct = location.pathname === "/admin/products/create-product";
    
//     return ( 
//         <>
//             {/* <AdminHeaders>
//                 Products
//                 <PrimaryButton onClick={() => navigate("/admin/products/create-product")}>
//                 Create
//                 </PrimaryButton>
//             </AdminHeaders> */}
//             {!isCreatingProduct && (
//                 <AdminHeaders>
//                     Car List
//                     <PrimaryButton onClick={() => navigate("/admin/products/create-product")}>
//                         Create Car
//                     </PrimaryButton>
//                 </AdminHeaders>
//             )}
//             <Outlet />
//         </>
        
        
//     );
    
// }
 
// export default Products;