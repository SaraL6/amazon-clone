import HomeRating from "./HomeRating";
import React, { useContext, useEffect, useRef } from "react";
import { db } from "./firebase";

import "./Product.css";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import { OrdersContext } from "./ordersContext";

function Product({
  id,
  title,
  image,
  price,
  rating,
  description,
  productOrders,
}) {
  const [{ basket, user }, dispatch] = useStateValue();
  const { orders, setOrders } = useContext(OrdersContext);
  let usersRef = db.collection("users");
  let products = [];
  const newDataRef = useRef(null);

  useEffect(() => {
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.id === id) {
          productOrders.push(order);
        }
      });
    });
  }, [orders]);

  const addToBasket = () => {
    // dispatch the item into the
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        description: description,
        price: price,
        rating: rating,
        orders: productOrders,
      },
    });
  };
  return (
    <div className="product">
      <div className="product__info">
        <Link
          to={{
            pathname: "/product/" + id,
            state: {
              id: id,
              title: title,
              image: image,
              price: price,
              rating: rating,
              description: description,
              orders: productOrders,
              userId: user?.uid,
            },
          }}
        >
          <p>{title}</p>
        </Link>

        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          <HomeRating rating={rating}></HomeRating>
        </div>
      </div>

      <img
        alt=""
        src={image}
        onError={(e) => (
          (e.target.onerror = null),
          (e.target.src =
            "https://vermeeraustralia.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png")
        )}
      />
      <button className="button-14" onClick={addToBasket}>
        Add to Basket
      </button>
    </div>
  );
}

export default Product;
