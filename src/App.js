import React,{ useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';

function App() {

  // fetch api here
  useEffect(() => 
  {
    
    fetch('http://localhost:8000/api/test')
    .then(function(response){
      response.json().then(function(resp){
        console.log(resp);
      })
    })
  });
  return (
    // BEM
    <div className="App">
     <Header />
     <Home />
    </div>
  );
}

export default App;
