import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import { AverageRatingContext } from "./AverageRatingContext";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { UserRatingContext } from "./UserRatingContext";

export default function BasicRating(props) {
  const [value, setValue] = React.useState(props?.rating);
  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  const { averageRating, setAverageRating } = useContext(AverageRatingContext);
  let productRatings = db.collection("products").doc(`${props?.productId}`);

  useEffect(() => {
    productRatings.onSnapshot((doc) => {
      //console.log("productId", props);
      // console.log("Current data: ", doc.data());
      if (doc.data()?.averageRating) {
        setValue(doc.data()?.averageRating);
      }
    });
  }, [productUserRating]);

  useEffect(() => {
    setAverageRating(value);
  }, [value]);

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Rating name="read-only" value={value} precision={0.5} readOnly />
    </Box>
  );
}
