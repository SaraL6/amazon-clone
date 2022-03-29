import Rating from "./Rating";
import React from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";

function Product({ id, title, image, price, rating }) {
  const [{ basket, user }, dispatch] = useStateValue();

  const addToBasket = () => {
    // dispatch the item into the
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          <Rating rating={rating}></Rating>
          {/* {Array(rating)
            .fill()
            .map((_, i) => (
              <p>🌟</p>
            ))} */}
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
      {/* <img
        src={
          image != "null"
            ? image
            : "https://vermeeraustralia.com.au/wp-content/uploads/2016/12/attachment-no-image-available.png"
        }
        class="img-fluid"
        alt=""
      /> */}
      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
