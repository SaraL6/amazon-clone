/* eslint-disable */

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({ origin: true });
const stripe = require("stripe")(
  "sk_test_51HnqbtEnWfTQeFEgGbUC0rlbPFNHiRkLVOdjrZwgG6nmh2bBvG6h5iD4xH0WjFZ45RGrHS6Fy4nvRwroVVEYqSFs00pH5WFFqX"
);
const rp = require("request-promise");

// API

// -  App config
const app = express();
admin.initializeApp();

// - Middlewares
app.use(cors);
app.use(express.json());

var batch = admin.firestore().batch();

// - API routes
app.get("/", (request, response) => response.status(200).send("Hello World"));

exports.getProducts = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(401).json({
          message: "Not allowed",
        });
      }
      rp({
        uri: "https://fakestoreapi.com/products",
        qs: {
          format: "json",
        },
        headers: {
          "User-Agent": "Request-Promise",
          Connection: "keep-alive",
        },
        json: true, // Automatically parses the JSON string in the response
      })
        .then((data) => {
          console.log(data);
          let dataArr = Object.values(data);
          var batch = admin.firestore().batch();
        
          dataArr.forEach((element) => {
                // batch.set(docRef, { element });
                const docRef = admin
                .firestore()
                .collection("products")
                .doc(`${element.id}`)
                
                docRef.set({element})
                
          });
          // batch
          //   .commit()
          //   .then((response) => {
          //     console.log("Success");
          //   })
          //   .catch((err) => {
          //     console.error(err);
          //   });
          return res.status(200).json({
            dataArr,
          });
       
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: err,
          });
        });
    });
  });
exports.getCategories = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(401).json({
          message: "Not allowed",
        });
      }
      rp({
        uri: "https://fakestoreapi.com/products/categories",
        qs: {
          format: "json",
        },
        headers: {
          "User-Agent": "Request-Promise",
          Connection: "keep-alive",
        },
        json: true, // Automatically parses the JSON string in the response
      })
        .then((data) => {
          console.log(data);
          admin.firestore().collection("categories").add({ categories: data });
          return res.status(200).json({
            categories: data,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: err,
          });
        });
    });
  });

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("query", request.query);
  console.log("Payment Request Recived for this amount:>>>", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of currency
    currency: "usd",
  });
  // OK -created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});
// - Listen command
exports.api = functions.https.onRequest(app);

// Example endpoint
// http://localhost:5001/clone-2d894/us-central1/api
