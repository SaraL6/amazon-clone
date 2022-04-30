import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import SingleProduct from "./SingleProduct";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Orders from "./Orders";
import { OrdersContext } from "./ordersContext";
import { UserRatingContext } from "./UserRatingContext";
import { ProductsContext } from "./ProductsContext";

const promise = loadStripe(
  "pk_test_51HnqbtEnWfTQeFEgry9VuDuyY9bBY2YK3eYMlQotNyxtrrcrOBcaYAk2PZqdeY0hLkDobuBXDm2CkyIxwHJ8huq100UN0boPq1"
);

function App() {
  // fetch api here
  // useEffect(() => {
  //   fetch("http://localhost:8000/api/test").then(function (response) {
  //     response.json().then(function (resp) {
  //       console.log(resp);
  //     });
  //   });
  // });
  const [orders, setOrders] = useState([]);
  const [productUserRating, setProductUserRating] = useState();
  const [products, setProducts] = useState([]);
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app componenet loads

    auth.onAuthStateChanged((authUser) => {
      // console.log('THE USER IS>>>',authUser);

      if (authUser) {
        // the user just logged in/the user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    // BEM
    <Router>
      <div className="App">
        <OrdersContext.Provider value={{ orders, setOrders }}>
          <UserRatingContext.Provider
            value={{ productUserRating, setProductUserRating }}
          >
            <ProductsContext.Provider value={{ products, setProducts }}>
              <Switch>
                <Route exact path="/orders">
                  <Header />
                  <Orders />
                </Route>

                <Route exact path="/login">
                  <Login />
                </Route>

                <Route exact path="/checkout">
                  <Header />
                  <Checkout />
                </Route>

                <Route exact path="/payment">
                  <Header />
                  <Elements stripe={promise}>
                    <Payment />
                  </Elements>
                </Route>

                <Route exact path="/product/:id">
                  <Header />
                  <SingleProduct />
                </Route>

                <Route exact path="/">
                  <Header />
                  <Home />
                </Route>
              </Switch>
            </ProductsContext.Provider>
          </UserRatingContext.Provider>
        </OrdersContext.Provider>
      </div>
    </Router>
  );
}

export default App;
