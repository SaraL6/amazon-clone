import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useStateValue } from "./StateProvider";
import { OrdersContext } from "./ordersContext";
import { UserRatingContext } from "./UserRatingContext";

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
  const [rated, setRated] = useState(false);
  const { orders, setOrders } = useContext(OrdersContext);
  let docRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("orders")

    .doc(orderId);


  const getRatedOrder = () => {
    if (rated) {
      console.log("first");
      db.collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            console.log("doc", doc.data());
          });
          // setOrders(
          //   snapshot.docs.map((doc) => ({
          //     id: doc.id,
          //     data: doc.data(),
          //   })),
          //   console.log("orders", orders)
          // );
        });
    }
  };
  //console.log("starValueon mount", starValue);
  useEffect(() => {
    if (user) {
      if (ratingState) {
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(orderId)
          .collection("basket")
          .doc(`${productId}`)
          .update({
            "product.userRating": starValue,
          })

          .then(() => {
            console.log("Document successfully updated!", orders);
            setRated(true);
            docRef.on("value", function (snapshot) {
              console.log(snapshot.val());
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
