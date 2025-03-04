const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/order");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const cartItems = req.body.cartItems;
  const userId = req.body.userId;

  const cartValue = JSON.stringify(cartItems).substring(0, 500); // комент
  const customer = await stripe.customers.create({
    metadata: {
      userId: userId,
      cart: cartValue, // комент
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "UA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.json({ url: session.url });
});

// Create Order
const createOrder = async (customer, data, lineItems) => {
  try {
    // const Items = JSON.parse(customer.metadata.cart);
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: lineItems.data, // тут був Items
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      payment_status: data.payment_status,
    });

    const savedOrder = await newOrder.save();
    console.log("PROCESSED ORDER : ", savedOrder);

    // return savedOrder; // Повертаємо збережений об'єкт
  } catch (error) {
    console.log("Error parsing JSON or saving order:", error.message);
    throw error;
  }
};

// Stripe webhook
// stripe listen --forward-to localhost:5000/api/stripe/webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret =
//   "whsec_46f9940fa3f694a6f8c39a29a919a78a217e635defbb218e3c1b8207210c5d4c";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("WEBHOOK VERIFIED");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).json(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer) // retrieve - отримати
        .then((customer) => {
          stripe.checkout.sessions.listLineItems(
            data.id,
            {},
            function (err, lineItems) {
              console.log("LINE ITEMS : ", lineItems);
              createOrder(customer, data, lineItems);
            }
          );

          // console.log("CUSTOMER : ", customer);
          // console.log("DATA : ", data);
        })
        .catch((error) => console.log(error.message));
    }
    // Return a 200 response to acknowledge receipt of the event
    res.json().end();
  }
);

module.exports = router;
