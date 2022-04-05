import React, { useState, useEffect, useContext } from "react";
import { db } from "./firebase";
import "./Orders.css";
import { useStateValue } from "./StateProvider";
import Order from "./Order";
import { OrdersContext } from "./ordersContext";
function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();

  const { orders, setOrders } = useContext(OrdersContext);
  console.log(orders);
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot(
          {
            // Listen for document metadata changes
            includeMetadataChanges: true,
          },
          (snapshot) => {
            setOrders(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
            // snapshot.docs.map((doc) => {
            //   console.log(doc.data());
            // });
          }
        );
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders__order">
        {orders?.map((order) => (
          <Order
            order={order}
            key={order.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Orders;
