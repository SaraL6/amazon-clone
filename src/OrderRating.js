import * as React from "react";
import firebase from "firebase";
import "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useStateValue } from "./StateProvider";
import { OrdersContext } from "./ordersContext";

export default function BasicRating({
  rating,
  orderId,
  productId,
  userRating,
}) {
  const [{ basket, user }, dispatch] = useStateValue();
  // const { starValue, setValue } = useContext(UserRatingContext);
  const [starValue, setValue] = useState(userRating);
  const [ratingState, setRating] = useState(false);
  const { orders, setOrders } = useContext(OrdersContext);
  let docRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("orders")
    .doc(orderId)
    .collection("basket")
    .doc(`${productId}`);

  let productRatings = db.collection("products").doc(`${productId}`);
  useEffect(() => {
    if (user) {
      if (ratingState) {
        docRef
          .update({
            "products.userRating": starValue,
          })

          .then(() => {
            productRatings.get().then((doc) => {
              if (doc.data()["ratings"]) {
                productRatings
                  .collection("ratings")
                  .doc(user?.uid)
                  .update({ rating: starValue });
              } else {
                productRatings
                  .collection("ratings")
                  .doc(user?.uid)
                  .set({
                    userId: user?.uid,
                    rating: starValue,
                    productId: productId,
                  });
              }
            });
          });
      }
    } else {
      setOrders([]);
    }
  }, [starValue]);

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Typography component="legend">Rate this product</Typography>
      <Rating
        name="simple-controlled"
        value={starValue}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
          setRating(true);
          // console.log("newValue", newValue);
        }}
      />
    </Box>
  );
}
