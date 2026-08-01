import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  let newOrder;

  try {
    console.log("ORDER BODY:", req.body);
    console.log("ORDER ITEMS:", req.body.items);

    if (
      !Array.isArray(req.body.items) ||
      req.body.items.length === 0
    ) {
      return res.json({
        success: false,
        message: "Your cart is empty"
      });
    }

    newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });

    await newOrder.save();

    const line_items = req.body.items.map((item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (!item.name) {
        throw new Error("One food item is missing its name");
      }

      if (!Number.isFinite(price) || price <= 0) {
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

          unit_amount: Math.round(price * 100)
        },

        quantity
      };
    });

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

    // Only clear the cart after the Stripe Session has been successfully created.
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
    console.error("TYPE:", error.type);
    console.error("CODE:", error.code);
    console.error("PARAM:", error.param);
    console.error("MESSAGE:", error.message);
    console.error("REQUEST ID:", error.requestId);
    console.error(
      "STRIPE LOG:",
      error.request_log_url
    );

    // If Stripe fails, delete the newly created unpaid order.
    if (newOrder?._id) {
      try {
        await orderModel.findByIdAndDelete(
          newOrder._id
        );
      } catch (deleteError) {
        console.log(
          "CANNOT DELETE FAILED ORDER:",
          deleteError.message
        );
      }
    }

    return res.json({
      success: false,
      message: error.message || "Unable to place order"
    });
  }
};

// Verify order payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// API for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: req.body.status
        });

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
