import axios from "axios"
import { useSelector } from "react-redux"
import { url } from "../slices/api"

const PayButton = ({cartItems}) => {
    
    const user = useSelector(state => state.auth)
    
    const handleCheckout = () => {
        console.log("CART ITEMS : ", cartItems)
        axios.post(`${url}/stripe/create-checkout-session`, {
            cartItems,
            userId: user._id
        }).then((res) => {
            if (res.data.url) {
                window.location.href = res.data.url  // перенаправлення браузера
                // на вказану URL - адресу, яка знаходиться в res.data.url
            }
        }).catch((error) => console.log(error.message))
    }
    
    return ( 
        <>
        <button onClick={() => handleCheckout()}>Check Out</button>
        </>
     );
}
 
export default PayButton;