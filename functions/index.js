const functions = require("firebase-functions");
const express = require ("express");
const cors = require ("cors");
const stripe = require("stripe")('sk_test_51HnqbtEnWfTQeFEgGbUC0rlbPFNHiRkLVOdjrZwgG6nmh2bBvG6h5iD4xH0WjFZ45RGrHS6Fy4nvRwroVVEYqSFs00pH5WFFqX');

// API

//-  App config
const app = express();

// - Middlewares
app.use(cors({ origin: true}));
app.use(express.json());

// - API routes
app.get('/', (request, response) => response.status(200).send("Hello World"))
app.post('/payments/create',async (request, response) => {
    const total = request.query.total;

    console.log('Payment Request Recived for this amount:>>>', total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //subunits of currency
        currency:"usd",
    });
// OK -created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})
// - Listen command
exports.api = functions.https.onRequest(app)

// Example endpoint
// http://localhost:5001/clone-2d894/us-central1/api




