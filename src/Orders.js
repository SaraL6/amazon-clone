import React, { useState, useEffect, useContext, useRef } from "react";
import firebase from "firebase";
import { db } from "./firebase";
import "./Orders.css";
import { useStateValue } from "./StateProvider";
import Order from "./Order";
import { OrdersContext } from "./ordersContext";
function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const { orders, setOrders } = useContext(OrdersContext);
  let usersRef = db.collection("users");

  let products = [];
  const newDataRef = useRef(null);
  let orderArr;
  useEffect(() => {
    if (user) {
      db.collectionGroup("basket")
        .where("userId", "==", user?.uid)
        .orderBy("created", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            products.push(doc.data());
          });
          let newData = newDataRef.current;
          newData = products.reduce((obj, item) => {
            if (obj[item.orderId]) {
              obj[item.orderId].products.push(item.products);
            } else {
              item.products = [item.products];
              obj[item.orderId] = {
                ...item,
              };
            }
            return obj;
          }, {});


          orderArr = Object.values(newData);
          // console.log(orderArr)
        

        
          setOrders(
            orderArr.map((order) => ({
              ...order,
            }))
          );
          // console.log("orders", orders);
        });
    } else {
      setOrders([]);
    }
  }, [user]);

  
  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders__order">
        {orders?.map((order) => {
          return <Order order={order} key={order.orderId}/>;
        })}
      </div>
    </div>
  );
}

export default Orders;
