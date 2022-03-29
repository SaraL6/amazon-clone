import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useStateValue } from "./StateProvider";
import { OrdersContext } from "./ordersContext";

export default function BasicRating({ rating, orderId, productId }) {
  const [{ basket, user }, dispatch] = useStateValue();
  const [value, setValue] = React.useState(0);
  const [ratingState, setRating] = useState(false);
  const { orders, setOrders } = useContext(OrdersContext);

  const getRatedOrder = () => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
    console.log("getratdorders", orders);
  };
  let ratedOrder;
  console.log("ordersbefore", orders);
  useEffect(() => {
    var docRef = db
      .collection("users")
      .doc(user?.uid)
      .collection("orders")
      .doc(orderId);
    if (user) {
      console.log("orderafter", orders);

      if (ratingState) {
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(orderId)
          .get()
          .then((doc) => {
            ratedOrder = [doc.data()];
          //  console.log("ratedOrderbefore", ratedOrder);
            ratedOrder.forEach((orderBasket) => {
              let basketArr = orderBasket;
              var reduced = basketArr.basket.reduce(function (filtered, item) {
                if (item.id === productId) {
                  item = { ...item, userRating: value };
                  var someNewValue = item;
                  filtered.push(someNewValue);
                }
                return filtered;
              }, []);
              //   console.log("reduced", reduced);
              const result = basketArr.basket.map((x) => {
                const item = reduced.find(({ id }) => id === x.id);
                return item ? item : x;
              });
           //   console.log("result", result);
              basketArr.basket = result;
              docRef
                .set(result[0])
                .then(console.log("getorders", basketArr.basket));
           //   console.log("basketArr.basket", basketArr.basket);
            });
           // console.log("ratedOrderafter", ratedOrder);
            //console.log("orderId", orderId);
          });
        console.log("orderafter", orders);
      }
    } else {
      setOrders([]);
    }
    console.log(orders);
  }, [value]);

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Typography component="legend">Rate this product</Typography>
      <Rating
        name="simple-controlled"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
          setRating(true);
          getRatedOrder();
        }}
      />
    </Box>
  );
}
