/* eslint-disable */

const admin = require('firebase-admin');
const functions = require("firebase-functions");
const express = require("express");
const cors = require('cors')({ origin: true });
const stripe = require("stripe")("sk_test_51HnqbtEnWfTQeFEgGbUC0rlbPFNHiRkLVOdjrZwgG6nmh2bBvG6h5iD4xH0WjFZ45RGrHS6Fy4nvRwroVVEYqSFs00pH5WFFqX");
const rp = require('request-promise');

// API

// -  App config
const app = express();
admin.initializeApp();

// - Middlewares
app.use(cors);
app.use(express.json());

// - API routes
app.get("/", (request, response) => response.status(200).send("Hello World"));

exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});


exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.getProducts = functions.runWith({
  timeoutSeconds: 300,
  memory: "1GB",
}).https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    rp({
      uri: 'https://fakestoreapi.com/products',
      qs: {
        format: 'json'
      },
      headers: {
        'User-Agent': 'Request-Promise',
        'Connection': 'keep-alive'
      },
      json: true // Automatically parses the JSON string in the response
    })
      .then(data => {
        console.log(data)
        admin.firestore().collection('products').add({ products: data });
        return res.status(200).json({
          products: data
        })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({
          message: err
        })
      })
  })
});
exports.getCategories = functions.runWith({
  timeoutSeconds: 300,
  memory: "1GB",
}).https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    rp({
      uri: 'https://fakestoreapi.com/products/categories',
      qs: {
        format: 'json'
      },
      headers: {
        'User-Agent': 'Request-Promise',
        'Connection': 'keep-alive'
      },
      json: true // Automatically parses the JSON string in the response
    })
      .then(data => {
        console.log(data)
        admin.firestore().collection('categories').add({ categories: data });
        return res.status(200).json({
          categories: data
        })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({
          message: err
        })
      })
  })
});


app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  // console.log("query", request.query)
  // console.log("Payment Request Recived for this amount:>>>", total);

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
// exports.api = functions.https.onRequest(app);

// Example endpoint
// http://localhost:5001/clone-2d894/us-central1/api


