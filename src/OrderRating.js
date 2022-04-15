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
import { UserRatingContext } from "./UserRatingContext";
import { OrderIdContext } from "./OrderIdContext";

export default function BasicRating({
  rating,
  orderId,
  productId,
  userRating,
}) {
  //console.log("userRating", userRating);

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
    .doc(orderId)
    .collection("basket")
    .doc(`${productId}`);

  let ordersBasketRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("orders")
    .orderBy("created", "desc");

  const getRatedOrder = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("orders")
      .doc("pi_3KksyTEnWfTQeFEg0JZWYZZP")
      .onSnapshot((querySnapshot) => {
        // querySnapshot.docs.map((doc) => {
        //   console.log("doc", doc.data());
        // });
        // console.log("fdsf", querySnapshot.data());
        // setOrders(
        //   querySnapshot.docs.map((doc) => ({
        //     id: doc.id,
        //     data: doc.data(),
        //   }))
        // );
      });
  };
  // getRatedOrder();
  useEffect(() => {
   // console.log(starValue);
    if (user) {
      if (ratingState) {
        docRef
          .update({
            "product.userRating": starValue,
            "product.price": 5,
          })

          .then(() => {
            console.log(user?.uid, orderId, productId);
            docRef.get().then((doc) => {
             // console.log("updated", doc.data().product);
              setValue(doc.data().product.userRating);
              //  getRatedOrder();
            });
            //  console.log("Document successfully updated!", orders);
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
