import React, { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import HomeRating from "./HomeRating";
import OrderRating from "./OrderRating";
import AddReview from "./AddReview";
import Ratings from "./Ratings";
import { UserRatingContext } from "./UserRatingContext";
import { ProductsContext } from "./ProductsContext";
import { AverageRatingContext } from "./AverageRatingContext";
import "./SingleProduct.css";
import LinearRatings from "./LinearRatings";
import Reviews from "./Reviews";

function SingleProduct() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orderId, setOrderId] = useState(null);
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  const { averageRating, setAverageRating } = useContext(AverageRatingContext);

  const { products, setProducts } = useContext(ProductsContext);
  let userRatings = [];
  const addToBasket = () => {
    // dispatch the item into the
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: location.state.id,
        title: location.state.title,
        image: location.state.image,
        description: location.state.description,
        price: location.state.price,
        rating: location.state.userRating,
      },
    });
  };

  const location = useLocation();
  useEffect(() => {
    console.log(location);
    location.state.orders &&
      location.state.orders.forEach((order) => {
        if (order?.userId === location.state.userId) {
          order?.products &&
            order?.products.forEach((product) => {
              if (product?.id === location.state.id) {
                setOrderId(order.orderId);
                setProductUserRating(order?.userRating);
              }
            });
        } else {
          console.log("error");
        }
      });
  }, []);
  useEffect(() => {
    products.forEach((product) => {
      if (product?.id === location.state.id) {
        product.orderIds &&
          product?.orderIds.forEach((order) => {
            console.log("order", order);
            setOrderId(order.orderId);
            userRatings.push(order.userRating);
            console.log("userRatings", userRatings);
          });
        setAverageRating(product?.averageRating);
      }
    });
  }, []);
  useEffect(() => {
    products.forEach((product) => {
      if (product.id === location.state.id) {
        product.orderIds &&
          product?.orderIds.forEach((order) => {
            setOrderId(order.orderId);
            console.log("order", order);
            userRatings.push(order.userRating);
            console.log("userRatings", userRatings);
          });
        setAverageRating(product?.averageRating);
      }
    });
  }, [productUserRating, products]);

  return (
    <>
      <div className="singleProduct">
        <div className="image">
          <img src={location.state.image + ""} alt="" className="productimg" />
          <div className="rate">
            {console.log("orderId", orderId)}
            {orderId && (
              <>
                <OrderRating
                  userRating={productUserRating}
                  orderId={orderId}
                  productId={location.state.id + ""}
                  rating={location.state.userRating}
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
            {console.log("userRatings", userRatings)}
            <small>
              {userRatings.length === 0
                ? "No ratings yet"
                : userRatings.length > 1
                ? userRatings.length` ratings`
                : userRatings.length` rating`}
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
      <div className="user_review_section">
        <div className="heading">
          <h2>User Reviews</h2>
        </div>
        <div className="reviews_section">
          <div className="ratings">
            <h3>Ratings</h3>
            <div className="averageRating">
              <h3>{averageRating} / 5</h3>
              <HomeRating
                rating={location.state.rating}
                productId={location.state.id}
              />

              <small>
                {userRatings.length === 0
                  ? "No ratings yet"
                  : userRatings.length > 1
                  ? userRatings.length` ratings`
                  : userRatings.length` rating`}
              </small>
            </div>
            <LinearRatings></LinearRatings>
            <Ratings></Ratings>
          </div>
          <div className="reviews">
            <h3 className="title">Write your own Review</h3>

            <AddReview></AddReview>
            <h3>Reviews</h3>
            <Reviews></Reviews>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
