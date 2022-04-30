import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import "./Home.css";
import Product from "./Product";
import CategoryFilter from "./CategoryFilter";
import { UserRatingContext } from "./UserRatingContext";
import { ProductsContext } from "./ProductsContext";

function Home() {
  const productSeederURL =
    "http://localhost:5001/clone-2d894/us-central1/getProducts";
  const categorySeederUrl =
    "http://localhost:5001/clone-2d894/us-central1/getCategories";

  const { products, setProducts } = useContext(ProductsContext);
  const [unfilteredProducts, setunfilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [value, setCategoryValue] = React.useState();

  const { productUserRating, setProductUserRating } =
    useContext(UserRatingContext);
  //console.log(productUserRating);
  let productsArr = [];
  let ratingsArr;
  let ratings = [];
  let averageRatings = [];
  const newDataRef = useRef(null);
  const resultRef = useRef(null);
  const averageRatingsRef = useRef(null);

  let isDone = false;
  const onChangeCategory = (newValue) => {
    setCategoryValue(newValue);
    setProducts(unfilteredProducts);
  };

  async function seederHandler() {
    const response = await fetch(productSeederURL);
    const data = await response.json();

    productsArr = data.dataArr;

    //console.log("data", data.dataArr);
    setProducts(productsArr);
    setunfilteredProducts(productsArr);
    categoryHandler();
  }

  async function categoryHandler() {
    const response = await fetch(categorySeederUrl);
    const data = await response.json();
  }

  function getRatings() {
    db.collectionGroup("ratings")
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          //  console.log("doc", doc.data());

          ratings.push(doc.data());
          // console.log("first", ratings);
          //         getAverage(ratingsArr);
        });
        // let newData = newDataRef.current;
        // newData = ratings.reduce((obj, item) => {
        //   if (obj[item.productId]) {
        //     obj[item.productId].rating.push(item.rating);
        //   } else {
        //     item.rating = [item.rating];
        //     obj[item.productId] = {
        //       ...item,
        //     };
        //   }
        //   return obj;
        // }, {});
        // ratingsArr = Object.values(newData);
        // console.log("ratings", ratings);
        let result = ratings.reduce(
          (r, { productId, orderId, rating, userId }) => {
            r[productId] = r[productId] || {
              productId,
              orderId,
              rating: [],
              userId,
            };
            r[productId].rating.push({
              orderId: orderId,
              rating: rating,
              userId: userId,
            });
            return r;
          },
          {}
        );
        ratingsArr = Object.values(result);

        ratingsArr.forEach((element) => {
          // console.log(element);
          element.rating.map((rating) => {
            //  return console.log("first", rating);
          });
        });
        //  console.log("result", ratingsArr);
        return getAverage(ratingsArr);
      })
      .catch(function (err) {
        //   console.log(err.message);
      });
  }
  async function getAverage(ratings) {
    await ratings.forEach((rating) => {
      //console.log(rating.productId);
      let r = rating.rating;
      // console.log("r", r);
      let sum = 0;
      let orderIds = [];
      r.forEach(async (element) => {
        // console.log(element);

        sum += element.rating;
        orderIds.push({
          orderId: element.orderId,
          userId: element.userId,
          userRating: element.rating,
        });
      });
      const avg = sum / r.length;
      averageRatings.push({
        rating: avg,
        productId: rating.productId,
        orderIds: orderIds,
      });
      // console.log("avrgR", averageRatings);
    });
    return averageRatings;
  }

  useEffect(() => {
    console.log("products", products);
    const fetchData = async () => {
      if (products?.length === 0) {
        let average = averageRatingsRef.current;
        average = await getRatings();
        const newData = await db
          .collection("products")
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
              productsArr.push(doc.data());
              //     console.log(productsArr);
            });
          })
          .catch(function (err) {
            console.log(err.message);
          });
        let result = resultRef.current;
        productsArr.forEach((product, key) => {
          averageRatings?.forEach((avgRating) => {
            if (avgRating?.productId == product.id) {
              productsArr[key] = { ...product, ...avgRating };
            }
          });
        });
        // result = averageRatings?.map((v) => ({
        //   ...v,
        //   ...productsArr.find((sp) => sp.id === v.productId),
        // }));
        // console.log("result", productsArr);
        ///////
        // var companyUsers = {}; // hashmap of users using companyId as keys

        // products.forEach(function (product) {
        //   companyUsers[product.id] = product;
        // });

        // // map new array based on each subscription
        // var res = result.map(function (sub) {
        //   var product = companyUsers[sub.productId];
        //   if (product) {
        //     for (var key in product) {
        //       sub[key] = product[key];
        //     }
        //   }
        //   return sub;
        // });
        //  console.log("res", res);
        // result.map((x) => {
        //   let index = productsArr.findIndex((d) => d.id === x.productId);
        //   productsArr[index] = x;
        //   //   console.log("productsArr", x);
        // });
        // console.log("newProducts", productsArr);
        setProducts(productsArr);
        setunfilteredProducts(productsArr);
        isDone = true;
      }
    };
    fetchData();

    if (categories.length === 0) {
      db.collection("categories").onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          // console.log("doc", doc.data());
          setCategories(doc.data().categories);
        })
      );
    }
  }, []);

  useEffect(() => {
    if (value && value.length > 0) {
      // console.log(products);
      var reduced = products.reduce(function (filtered, product) {
        if (product.category === value) {
          var someNewValue = product;

          filtered.push(someNewValue);
        }

        return filtered;
      }, []);
      setProducts(reduced);
    }
  }, [value]);

  return (
    <div className="home">
      <div className="home__container">
        <img
          className="home__image"
          src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
          alt=""
        />
        <CategoryFilter
          categories={categories}
          value={value}
          onChangeCategory={onChangeCategory}
        ></CategoryFilter>

        <div className="home__row">
          {products?.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              description={product.description}
              rating={product.rating ? product.rating : 0}
              orders={product.orderIds}
            />
          ))}
        </div>
        <div className="home__row"></div>
        <div className="home__row">
          <Product
            id="90829332"
            title="Samsung LC49RG90SSUXEN 49' Curved LED Gaming Monitor - Super Ultra Wide Dual WQHD 5120 x 1440"
            price={1094.98}
            rating={4}
            image="https://images-na.ssl-images-amazon.com/images/I/6125mFrzr6L._AC_SX355_.jpg"
          />
        </div>
        <button onClick={seederHandler}>Seed</button>
      </div>
    </div>
  );
}

export default Home;
