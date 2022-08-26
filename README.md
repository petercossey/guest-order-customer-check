# Guest order customer check
Proof of concept for a middleware which updates guests orders where a custom already exists.

## Problem statement
It's possible to have checkout settings which allow registered users to place orders as guests - the advantage of that configuration is that it removes any sign-in friction for checkout.

The downside is that any order placed as a guest (even for customers who have a registered email address) cannot be included on the customers account pages due to security reasons.

## Solution

> **Code Samples Disclaimer**
>
> This document may include code samples for demonstration and illustration purposes. BigCommerce provides these samples without guarantee or warranty. It is the responsibility of Client, or an agency contracted by Client, to ensure any custom code functions as expected.
>
> This POC doesn't utlise of the security features available to BigCommerce webhook callbacks - implementing webhooks in a product system to incorporate [relevant security precautions](https://developer.bigcommerce.com/docs/ZG9jOjIyMDczMg-overview#security).

Create a webhook for the scope store/order/created and use a serverless function or custom middleware to receive the webhook event and update the order if meets the following criteria:
- Order is a guest order, i.e. "customer_id" = 0
- A customer already exists with an email address matching the email on the order billing address, i.e. "billing_address.email"
  - Search for an customer with an email address using the Customers API [Get All Customers endpoint](https://api.bigcommerce.com/stores/{{store_hash}}/v3/customers?email:in=guest@example.com). Use the `email:in` query parameter, e.g. `GET https://api.bigcommerce.com/stores/{{store_hash}}/v3/customers?email:in=guest@example.com`
  - Update order using the Orders API [Update an Order endpoint](https://developer.bigcommerce.com/api-reference/d140040bfe6ef-update-an-order) to change the `customer_id` field to relevant result from customer search query.
