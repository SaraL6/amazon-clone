import React from "react";
import { useState, useEffect } from "react";
import "./Home.css";
import Product from "./Product";


function Home() {
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  const [categories, setCategories] = useState([]);
  const seederURL = 'http://localhost:5001/clone-2d894/us-central1/checkIP';


  async function seederHandler() {

    const response = await fetch(seederURL);
    const data = await response.json();
    let newProductsArr = []
    let oldProductsArr = data.products;//not formatted
    let productArr = oldProductsArr.map(product => newProductsArr.push(product)) //formatted

    setProducts(newProductsArr);
    // console.log("newProductsArr", newProductsArr);
    // console.log("data.products", data.products);
    // console.log("productArr", productArr);
    // console.log(products);

  }
  useEffect(() => {

    if (products && products.length > 0)
      window.localStorage.setItem("products", JSON.stringify(products))
    console.log("useEffectproducts", products);

  }, [products])

  return (
    <div className="home">
      <div className="home__container">

        <img
          className="home__image"
          src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
          alt=""
        />

        <div className="home__row">

          {products?.map((product) => (
            < Product
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              rating={2}
            />
          ))}

        </div>
        <div className="home__row">

        </div>
        <div className="home__row">
        </div>
        <button onClick={seederHandler}>Seed</button>
      </div>
    </div>
  );
}

export default Home;
