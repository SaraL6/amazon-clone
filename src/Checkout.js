import React, { useContext,useEffect } from "react";
import "./Checkout.css";
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import Subtotal from "./Subtotal";
import FlipMove from "react-flip-move";
import { forwardRef } from "react";
import { OrdersContext } from "./ordersContext";

function Checkout() {
  const [{ basket, user }, dispatch] = useStateValue();
  const { orders, setOrders } = useContext(OrdersContext);

  basket.map((item) => {
    console.log("basketItem", item);
  });
  useEffect(() => {
   basket.map((order)=>{
    console.log("order",order)
   })
  }, [])
  
  return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />
        <div>
          <h3>Hello,{user?.email}</h3>
          <h2 className="checkout__title">Your shopping Basket</h2>
          {basket.map((item) => (
            <CheckoutProduct
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              description={item.description}
              // rating={item.rating}
              orders={item.orders}
              userRating={item.userRating ? item.userRating : 0}
            />
          ))}
        </div>
      </div>
      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  );
}

export default Checkout;
