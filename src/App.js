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
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Orders from "./Orders";

const promise = loadStripe('pk_test_51HnqbtEnWfTQeFEgry9VuDuyY9bBY2YK3eYMlQotNyxtrrcrOBcaYAk2PZqdeY0hLkDobuBXDm2CkyIxwHJ8huq100UN0boPq1');

function App() {
  // fetch api here
  // useEffect(() => {
  //   fetch("http://localhost:8000/api/test").then(function (response) {
  //     response.json().then(function (resp) {
  //       console.log(resp);
  //     });
  //   });
  // });
  const [{},dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app componenet loads

    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS>>>',authUser);

      if(authUser) {
        // the user just logged in/the user was logged in 
        dispatch({
          type:'SET_USER',
          user:authUser
        })
        
      }else {
        // the user is logged out
        dispatch({
          type:'SET_USER',
          user: null
        })
      }
    })
  },[])

  return (
    // BEM
    <Router>
      <div className="App">
        <Switch>
          <Route path="/orders">
          <Header />
            <Orders />
          </Route>
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
