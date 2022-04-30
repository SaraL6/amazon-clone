import React from "react";
import "./CheckoutProduct.css";
import { useContext, useEffect } from "react";
import OrderRating from "./OrderRating";
import { useStateValue } from "./StateProvider";
import { UserRatingContext } from "./UserRatingContext";

function CheckoutProduct({
  id,
  image,
  title,
  price,
  userRating,
  hideButton,
  orderId,
}) {
  const [{ basket }, dispatch] = useStateValue();
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);

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
        <p className="checkoutProduct__title">{title}</p>

        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{price}</strong>{" "}
        </p>
        <div className="checkoutProduct__rating">
          {productUserRating && (
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
