import React, { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import HomeRating from "./HomeRating";
import OrderRating from "./OrderRating";
import { UserRatingContext } from "./UserRatingContext";

import "./SingleProduct.css";
function SingleProduct() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orderId, setOrderId] = useState(null);
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);

  const addToBasket = () => {
    // dispatch the item into the
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: location.state.id,
        title: location.state.title,
        image: location.state.image,
        price: location.state.price,
        rating: location.state.rating,
      },
    });
  };

  const location = useLocation();

  console.log(location);

  useEffect(() => {
    console.log("singleproductuserRating", productUserRating);

    location.state.orders &&
      location.state.orders.forEach((order) => {
        if (order?.userId === location.state.userId) {
          //  console.log(order?.orderId);
          setOrderId(order?.orderId);
          
         setProductUserRating(order?.userRating);
        } else {
          console.log("error");
        }
      });
  }, []);

  useEffect(() => {
    console.log("singleproductuserRating", productUserRating);
  }, [productUserRating]);

  return (
    <div className="singleProduct">
      <div className="image">
        <img src={location.state.image + ""} alt="" className="productimg" />
        <div className="rate">
          {orderId && (
            <OrderRating
              userRating={productUserRating}
              orderId={orderId}
              productId={location.state.id + ""}
            ></OrderRating>
          )}
        </div>
      </div>
      <div className="details">
        <h3>{location.state.title}</h3>
        <p>{location.state.description}</p>

        <HomeRating rating={location.state.rating} />
        <div className="add">
          <h3 className="price">{location.state.price} $</h3>
          <button onClick={addToBasket}>Add to Basket</button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
