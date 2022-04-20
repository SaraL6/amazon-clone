import React from "react";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Home.css";
import Product from "./Product";
import CategoryFilter from "./CategoryFilter";

function Home() {
  const productSeederURL =
    "http://localhost:5001/clone-2d894/us-central1/getProducts";
  const categorySeederUrl =
    "http://localhost:5001/clone-2d894/us-central1/getCategories";

  const [products, setProducts] = useState([]);
  const [unfilteredProducts, setunfilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [value, setCategoryValue] = React.useState();
  let productsArr = [];

  const onChangeCategory = (newValue) => {
    setCategoryValue(newValue);
    setProducts(unfilteredProducts);
  };

  async function seederHandler() {
    const response = await fetch(productSeederURL);
    const data = await response.json();
    productsArr = data.dataArr;

    console.log("data", data.dataArr);
    setProducts(productsArr);
    setunfilteredProducts(productsArr);
    categoryHandler();
  }

  async function categoryHandler() {
    const response = await fetch(categorySeederUrl);
    const data = await response.json();
  }

  useEffect(() => {
   // console.log("products", productsArr);
    if (products.length === 0) {
      db.collection("products")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            // console.log("first", doc.data());
            productsArr.push(doc.data());
            setProducts(productsArr);
            setunfilteredProducts(productsArr);
          });
        });
    }
    if (categories.length === 0) {
      db.collection("categories").onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          // console.log("doc", doc.data());
          setCategories(doc.data().categories);
        })
      );
    }
  }, [products, categories]);

  useEffect(() => {
    // console.log("productsArr", productsArr);
  }, [products]);
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
          {products?.map((product) => {
            return (
              <Product
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                rating={product.rating.rate}
              />
            );
          })}
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
