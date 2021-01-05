import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const promise = loadStripe('pk_test_51HnqbtEnWfTQeFEgry9VuDuyY9bBY2YK3eYMlQotNyxtrrcrOBcaYAk2PZqdeY0hLkDobuBXDm2CkyIxwHJ8huq100UN0boPq1');

function App() {
  // fetch api here
  useEffect(() => {
    fetch("http://localhost:8000/api/test").then(function (response) {
      response.json().then(function (resp) {
        console.log(resp);
      });
    });
  });
  return (
    // BEM
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/checkout">
            <Header />

            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
            <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header />

            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
