import React from "react";
import { useContext,useEffect } from "react";
import "./Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";

function Order({ order }) {
  const [{ basket, user }, dispatch] = useStateValue();


  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(order.created).format("MMMM Do YYYY, h:mma")}</p>

      <p className="order__id">
        <small>{order.orderId}</small>
      </p>

      {order.products.map((item) => (
  
          <CheckoutProduct
            key={item.id}
            orderId={order.orderId}
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            price={item.price}
            rating={item.rating}
            orders={item.orders}
            userRating={item.userRating ? item.userRating : 0}
            hideButton
          />
      ))}

      <CurrencyFormat
        renderText={(value) => (
          <h3 className="order__total">Order Total: {value}</h3>
        )}
        decimalScale={2}
        value={order.orderTotal / 100}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
    </div>
  );
}

export default Order;
