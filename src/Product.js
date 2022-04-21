import HomeRating from "./HomeRating";
import React from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { useState, useEffect } from "react";
import { db } from "./firebase";
function Product({ id, title, image, price }) {
  const [{ basket, user }, dispatch] = useStateValue();
  const [rating, setRating] = useState();
  let ratingsArr = [];
  let done = false;

  async function getRatings() {
    await db
      .collectionGroup("ratings")
      .where("productId", "==", id)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          ratingsArr.push(doc.data().rating);
        });
      });
    return ratingsArr;
  }
  async function getAverage() {
    const ratings = await getRatings();
    console.log("ratings", ratings);

    var total = 0;
    for (var i = 0; i < ratings.length; i++) {
      total += ratings[i];
    }
    var avg = total / ratings.length;
    done = true;
    setRating(avg);
    return avg;
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAverage();
     // console.log("data", data);
      setRating(data);
    };
    fetchData();
  }, [done]);

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
      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
