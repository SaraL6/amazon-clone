import React from "react";
import "./CheckoutProduct.css";
import { useContext, useEffect, useState } from "react";
import OrderRating from "./OrderRating";
import { useStateValue } from "./StateProvider";
import { UserRatingContext } from "./UserRatingContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { OrdersContext } from "./ordersContext";

function CheckoutProduct({
  id,
  image,
  title,
  description,
  price,
  userRating,
  //orders,
  rating,
  hideButton,
  orderId,
}) {
  const [{ basket, user }, dispatch] = useStateValue();
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  const { orders, setOrders } = useContext(OrdersContext);
  const [hideRating, setHideRating] = useState(false);
  let location = useLocation();

  const removeFromBasket = () => {
    // remove item from basket
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };
  useEffect(() => {
    // console.log("first", userRating);
    userRating && setProductUserRating(userRating);
  
    if (location.pathname === "/payment" || location.pathname === "/checkout") {
      setHideRating(true);
    } else if (location.pathname !== "/payment" || "/checkout") {
      setHideRating(false);
    }

  }, []);

  return (
    <div className="checkoutProduct">
      <img
        className="checkoutProduct__image"
        src={image}
        alt=""
        onError={(e) => (
          (e.target.onerror = null),
          (e.target.src =
            "https://vermeeraustralia.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png")
        )}
      />

      <div className="checkoutProduct__info">
        <Link
          to={{
            pathname: "/product/" + id,
            state: {
              id: id,
              title: title,
              image: image,
              price: price,
              rating: userRating,
              description: description,
              orders: orders,
              userId: user?.uid,
            },
          }}
        >
          <p className="checkoutProduct__title">{title}</p>{" "}
        </Link>

        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{price}</strong>{" "}
        </p>
        <div className="checkoutProduct__rating">
          {!hideRating && (
            <OrderRating
              userRating={productUserRating}
              orderId={orderId}
              productId={id}
            ></OrderRating>
          )}
        </div>
        {!hideButton && (
          <button onClick={removeFromBasket}>Remove from basket</button>
        )}
      </div>
    </div>
  );
}

export default CheckoutProduct;
