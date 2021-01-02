import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";

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
            <Login/>
          </Route>

          <Route path="/checkout">
          <Header />

            <Checkout />
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
