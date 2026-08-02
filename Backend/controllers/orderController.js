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
      "STRIPE_SECRET_KEY environment variable is missing"
    );
  }

  return new Stripe(stripeSecretKey);
};

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = (
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");

  let newOrder;

  try {
    if (
      !Array.isArray(req.body.items) ||
      req.body.items.length === 0
    ) {
      return res.json({
        success: false,
        message: "Your cart is empty"
      });
    }

    // Chỉ tạo Stripe khi khách thực sự đặt hàng.
    // Thiếu key sẽ được catch bên dưới,
    // không làm toàn bộ Backend crash.
    const stripe = createStripeClient();

    newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
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
            `Invalid price for ${item.name}`
          );
        }

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error(
            `Invalid quantity for ${item.name}`
          );
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name
            },
            unit_amount:
              Math.round(price * 100)
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
        unit_amount: 200
      },
      quantity: 1
    });

    const session =
      await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",

        success_url:
          `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

        cancel_url:
          `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
      });

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
    console.error(
      "PLACE ORDER ERROR:",
      error.message
    );

    if (newOrder?._id) {
      try {
        await orderModel.findByIdAndDelete(
          newOrder._id
        );
      } catch (deleteError) {
        console.error(
          "DELETE FAILED ORDER ERROR:",
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