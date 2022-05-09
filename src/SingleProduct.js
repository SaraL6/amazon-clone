import React, { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import HomeRating from "./HomeRating";
import OrderRating from "./OrderRating";
import { UserRatingContext } from "./UserRatingContext";
import { ProductsContext } from "./ProductsContext";
import { OrdersContext } from "./ordersContext";

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
<<<<<<< HEAD
=======
  console.log(location.state);
>>>>>>> 472c662a70bca093ff72a295e201ab49b80e811f
  useEffect(() => {
    location.state.orders &&
      location.state.orders.forEach((order) => {
        if (order?.userId === location.state.userId) {

          order?.products?.forEach((element) => {
            if (element.id == location.state.id) {
              setOrderId(order?.orderId);
              setProductUserRating(element?.userRating);
            }
          });
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
            <>
              <OrderRating
                userRating={productUserRating}
                orderId={orderId}
                productId={location.state.id + ""}
                rating={location.state.rating}
              ></OrderRating>
            </>
          )}
        </div>
      </div>
      <div className="details">
        <h2>{location.state.title}</h2>
        <h3>About this item</h3>
        <p>{location.state.description}</p>
        <div className="averageRate">
          <HomeRating
            rating={location.state.rating}
            productId={location.state.id}
          />
          <small>
            {/* {location.state.orders == 0
              ? "No ratings yet"
              : location.state.orders.length}
            {location.state.orders.length > 1 ? ` ratings` : ` rating`} */}
            {/* {location.state.orders == 0
              ? "No ratings yet"
              : location.state.orders.length > 1
              ? ` ratings`
              : ` rating`} */}
          </small>
        </div>
        <div className="add">
          <h3 className="price">{location.state.price} $</h3>
          <button className="button-14" onClick={addToBasket}>
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
