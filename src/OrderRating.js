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
import { ProductsContext } from "./ProductsContext";

export default function BasicRating({ orderId, productId, userRating }) {
  const [{ basket, user }, dispatch] = useStateValue();
  // const { starValue, setValue } = useContext(UserRatingContext);
  const [starValue, setValue] = useState(userRating);
  const [ratingState, setRating] = useState(false);
  const { orders, setOrders } = useContext(OrdersContext);
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  const { products, setProducts } = useContext(ProductsContext);

  //console.log("checkoutUserRating", productUserRating, "productId", productId);
  let productsArr = [];
  let ratings = [];
  let docRef = db
    .collection("users")
    .doc(user?.uid)
    .collection("orders")
    .doc(orderId)
    .collection("basket")
    .doc(`${productId}`);

  let productRatings = db.collection("products").doc(`${productId}`);
  useEffect(() => {
    db.collectionGroup("ratings")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().orderId == orderId) {
            console.log("doc", doc.data());
            setProductUserRating(doc.data().rating);
            setValue(doc.data().rating);
          }
        });
      });
    console.log("starValue", starValue);
  }, []);

  useEffect(() => {
    // console.log("products", products);
    products?.forEach((product) => {
      if (product.id == productId) {
        product.orderIds.forEach((order, key) => {
          if (order.orderId == orderId) {
            //  console.log(order);
            order.userRating = productUserRating;
            //  console.log("order", order);
          }
        });
      } else {
        console.log("error");
      }
    });
  }, [products]);

  useEffect(() => {
    // console.log("starValue", starValue);
    setProductUserRating(userRating);

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
                productRatings.collection("ratings").doc(user?.uid).set({
                  userId: user?.uid,
                  rating: starValue,
                  productId: productId,
                  orderId: orderId,
                });
              }
            });
          });
      }
    } else {
      setOrders([]);
    }
  }, [starValue]);
  useEffect(() => {
    if (userRating) {
      //console.log("userRATING", userRating);

      setProductUserRating(userRating);
      //  console.log("productUserRating", productUserRating);
    }
  }, [userRating]);

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
          setProductUserRating(newValue);
        }}
      />
    </Box>
  );
}
