import React, { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import HomeRating from "./HomeRating";
import OrderRating from "./OrderRating";
import { UserRatingContext } from "./UserRatingContext";
import { ProductsContext } from "./ProductsContext";

import "./SingleProduct.css";
function SingleProduct() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orderId, setOrderId] = useState(null);
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  const { products, setProducts } = useContext(ProductsContext);

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


  useEffect(() => {
    location.state.orders &&
      location.state.orders.forEach((order) => {
        if (order?.userId === location.state.userId) {
          setOrderId(order?.orderId);

          setProductUserRating(order?.userRating);
        } else {
          console.log("error");
        }
      });
  }, []);



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
              rating={location.state.rating}
            ></OrderRating>
          )}
        </div>
      </div>
      <div className="details">
        <h3>{location.state.title}</h3>
        <p>{location.state.description}</p>

        <HomeRating rating={location.state.rating} productId={location.state.id} />
        <div className="add">
          <h3 className="price">{location.state.price} $</h3>
          <button onClick={addToBasket}>Add to Basket</button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
