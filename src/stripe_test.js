// console.log("Loki")
const express = require("express");
const app = express();

//import { stripe } from './utils/stripeUtil';
const stripe = require("stripe")(
  "sk_test_51I49DEFIPEY2MboGph4ZtblIMJ458yrU33o68tTLNNp65X5NiPpgAiix87GurwaNqKY9xMNs5jTCKm6hgQreYdZT009vRRYG5x"
);

app.listen(3003, function () {
  console.log("Server started");
});

export const createCustomer = function () {
  const params = {};
  params.email = "admin@me.com";
  params.name = "Mike";
  params.description = "the account create from node stripe";

  stripe.customers.create(params, function (error, customer) {
    if (error) {
      console.log("error:", error);
    }
    if (customer) {
      console.log("success:", customer);
    } else {
      console.log("something went wrong");
    }
  });
};

// createCustomer();

export const retrieveCustomer = function () {
  stripe.customers.retrieve("req_4yXutGjNBNZjft", function (error, customer) {
    if (error) {
      console.log("error:", error);
    }
    if (customer) {
      console.log("success:", customer);
    } else {
      console.log("something went wrong");
    }
  });
};

// retrieveCustomer();
