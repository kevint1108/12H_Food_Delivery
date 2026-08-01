import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Do not initialize Stripe at the top level.
// Initialize it only when the customer actually places an order.
const createStripeClient = () => {
  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing"
    );
  }

  return new Stripe(stripeSecretKey);
};

// Placing user order for frontend
const placeOrder = async (req, res) => {
  /*
  This must be the FRONTEND URL for Stripe
  to redirect the user back to after payment. 

  Local:
  http://localhost:5173

  Vercel:
  https://12-h-food-delivery-bncr.vercel.app
*/
  const frontend_url = (
    process.env.FRONTEND_URL ||
    "https://12-h-food-delivery-bncr.vercel.app/"
  ).replace(/\/$/, "");

  let newOrder;

  try {
    console.log("ORDER BODY:", req.body);
    console.log("ORDER ITEMS:", req.body.items);
    console.log("FRONTEND URL:", frontend_url);

    if (
      !Array.isArray(req.body.items) ||
      req.body.items.length === 0
    ) {
      return res.json({
        success: false,
        message: "Your cart is empty"
      });
    }

    if (!req.body.userId) {
      return res.json({
        success: false,
        message: "User ID is missing"
      });
    }

    if (
      !req.body.address ||
      typeof req.body.address !== "object"
    ) {
      return res.json({
        success: false,
        message: "Delivery address is missing"
      });
    }

    const orderAmount =
      Number(req.body.amount);

    if (
      !Number.isFinite(orderAmount) ||
      orderAmount <= 0
    ) {
      return res.json({
        success: false,
        message: "Invalid order amount"
      });
    }

    // Only initialize Stripe when placing an order.
    const stripe = createStripeClient();

    newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: orderAmount,
      address: req.body.address
    });

    await newOrder.save();

    const line_items = req.body.items.map(
      (item) => {
        const price = Number(item.price);
        const quantity =
          Number(item.quantity);

        if (!item.name) {
          throw new Error(
            "One food item is missing its name"
          );
        }

        if (
          !Number.isFinite(price) ||
          price <= 0
        ) {
          throw new Error(
            `Invalid price for ${item.name}: ${item.price}`
          );
        }

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error(
            `Invalid quantity for ${item.name}: ${item.quantity}`
          );
        }

        return {
          price_data: {
            currency: "usd",

            product_data: {
              name: item.name
            },

            unit_amount: Math.round(
              price * 100
            )
          },

          quantity
        };
      }
    );

    line_items.push({
      price_data: {
        currency: "usd",

        product_data: {
          name: "Delivery Charges"
        },

        unit_amount: 2 * 100
      },

      quantity: 1
    });

    console.log(
      "STRIPE LINE ITEMS:",
      JSON.stringify(line_items, null, 2)
    );

    const session =
      await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",

        success_url:
          `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

        cancel_url:
          `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
      });

    // Only clear the cart after the Stripe Session
    // has been successfully created.
    await userModel.findByIdAndUpdate(
      req.body.userId,
      {
        cartData: {}
      }
    );

    return res.json({
      success: true,
      session_url: session.url
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR");
    console.error(
      "TYPE:",
      error.type
    );
    console.error(
      "CODE:",
      error.code
    );
    console.error(
      "PARAM:",
      error.param
    );
    console.error(
      "MESSAGE:",
      error.message
    );
    console.error(
      "REQUEST ID:",
      error.requestId
    );
    console.error(
      "STRIPE LOG:",
      error.request_log_url
    );

    // If Stripe fails, delete the unpaid order.
    if (newOrder?._id) {
      try {
        await orderModel.findByIdAndDelete(
          newOrder._id
        );
      } catch (deleteError) {
        console.error(
          "CANNOT DELETE FAILED ORDER:",
          deleteError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to place order"
    });
  }
};

// Verify order payment
const verifyOrder = async (req, res) => {
  const {
    orderId,
    success
  } = req.body;

  try {
    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID is missing"
      });
    }

    if (
      success === "true" ||
      success === true
    ) {
      await orderModel.findByIdAndUpdate(
        orderId,
        {
          payment: true
        }
      );

      return res.json({
        success: true,
        message: "Paid"
      });
    }

    await orderModel.findByIdAndDelete(
      orderId
    );

    return res.json({
      success: false,
      message: "Not Paid"
    });
  } catch (error) {
    console.error(
      "VERIFY ORDER ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Error verifying payment"
    });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders =
      await orderModel.find({
        userId: req.body.userId
      });

    return res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(
      "USER ORDERS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Error"
    });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders =
      await orderModel.find({});

    return res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(
      "LIST ORDERS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Error"
    });
  }
};

// Updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(
      req.body.orderId,
      {
        status: req.body.status
      }
    );

    return res.json({
      success: true,
      message: "Status Updated"
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Error"
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus
};